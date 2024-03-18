import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';

import {useHistory} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

import {MESSAGE_CODES, PUBLICATION_TYPES} from '/src/frontend/components/common/form/constants';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import MarcPreviewModal from '/src/frontend/components/common/subComponents/modals/MarcPreviewModal.jsx';
import MelindaResponseModal from '/src/frontend/components/common/subComponents/modals/MelindaResponseModal.jsx';

import {deleteEntry, downloadFile, makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';
import {publicationHasIdentifiers} from '/src/frontend/components/isbn-registry/publicationRequests/utils';


function IsbnPublicationRequestButtonRow(props) {
  const {
    publicationRequest,
    setIdentifierType,
    setIsEdit,
    setIsGrantingIdentifiers,
    setShowSpinner
  } = props;

  const intl = useIntl();
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const [melindaApiResponse, setMelindaApiResponse] = useState(null);

  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const hasIdentifiers = useMemo(() => publicationHasIdentifiers(publicationRequest), [publicationRequest]);

  // Handlers
  async function handleSaveToMelinda() {
    setShowSpinner(true);
    const result = await makeApiRequest({
      url: `/api/isbn-registry/marc/${publicationRequest.id}/send-to-melinda`,
      method: 'POST',
      authenticationToken
    });

    setShowSpinner(false);

    // Everything is fine, display banner
    if (result && typeof result === 'object' && !displayMelindaResponseDetails(result)) {
      return setSnackbarMessage({severity: 'success', message: `Melindaan tallentaminen onnistui. Luotiin ${result.records.length} uutta tietuetta.`});
    }

    // System integration has problem, notify with red banner
    if (!result && typeof result !== 'object') {
      return setSnackbarMessage({severity: 'error', message: 'Melindaan tallentaminen ei onnistunut järjestelmävirheen vuoksi. Ota yhteyttä sovellusylläpitoon.'});
    }

    // Something was not right in the API response, display result in Modal with detailed information
    return setMelindaApiResponse(result);
  }

  function closeMelindaResponseModal() {
    setMelindaApiResponse(null);
  }

  const handleGrantAnId = () => {
    const identifierTypeValue =
      publicationRequest.publicationType === PUBLICATION_TYPES.SHEET_MUSIC
        ? 'ismn'
        : 'isbn';
    setIdentifierType(identifierTypeValue);
    setIsGrantingIdentifiers(true);
  };

  async function handleCopyRequest() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/requests/publications/${publicationRequest.id}/copy`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      redirect(history, `/isbn-registry/requests/publications/${result.id}`);
    }

    setCopyModalIsOpen(false);
  }

  async function handleDeleteRequest() {
    await deleteEntry({
      url: `/api/isbn-registry/requests/publications/${publicationRequest.id}`,
      authenticationToken,
      history,
      redirectRoute: '/isbn-registry/requests/publications',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  // Display Melinda result modal only if it would contain meaningful information
  function displayMelindaResponseDetails(apiResponse) {
    if (!apiResponse || typeof apiResponse !== 'object') {
      return false;
    }

    const numSystemErrors = apiResponse?.errors?.length;
    const numRecordErrors = apiResponse?.records?.filter(({recordStatus}) => recordStatus !== 'CREATED').length;

    if (numSystemErrors === undefined || numRecordErrors === undefined) {
      return false;
    }

    if (numSystemErrors > 0 || numRecordErrors > 0) {
      return true;
    }

    return false;
  }

  function handleEditClick() {
    setIsEdit(true);
  }

  function handleGoBack() {
    if (history.location?.state?.searchBody) {
      return history.push({
        pathname: '/isbn-registry/requests/publications',
        state: {searchBody: history.location.state.searchBody}
      });
    }

    if (history.location?.state?.publisherId) {
      return history.push({
        pathname: `/isbn-registry/publishers/${history.location.state.publisherId}`
      });
    }

    return history.push({
      pathname: '/isbn-registry/requests/publications'
    });
  }

  // Handles sending a message with granted ids to the publisher
  const handleSendMessage = (identifierType) => {
    const redirectMessageCode =
      identifierType === 'isbn'
        ? MESSAGE_CODES.SEND_PUBLICATION_IDENTIFIERS_ISBN
        : MESSAGE_CODES.SEND_PUBLICATION_IDENTIFIERS_ISMN;

    history.push({
      pathname: '/isbn-registry/messages/form/send',
      state: {
        messageCode: redirectMessageCode,
        langCode: publicationRequest.langCode,
        publisherId: publicationRequest.publisherId,
        publicationId: publicationRequest.id,
        identifierBatchId: publicationRequest.identifierBatchId
      }
    });
  };

  // Handles downloading marc data
  async function handleDownloadMarc() {
    setShowSpinner(true);
    await downloadFile({
      url: `/api/isbn-registry/marc/${publicationRequest.id}?format=iso2709&download=true`,
      method: 'GET',
      authenticationToken,
      downloadName: `isbnregistry-publication-${publicationRequest.id}.mrc`
    });
    setShowSpinner(false);
  }

  // Handles the state of "Save to Melinda"-button (disabled/enabled)
  const melindaButtonIsDisabled = () => {
    // eslint-disable-line
    if (hasIdentifiers) return false; // If identifiers have been granted, setup is ok for taking information to Melinda
    if (publicationRequest.noIdentifierGranted) return true;
    if (!publicationRequest.publicationsPublic) return true;
    if (publicationRequest.publicationsIntra) return true;

    return false;
  };

  return (
    <>
      <Fab
        color="secondary"
        size="small"
        title={intl.formatMessage({id: 'form.button.label.back'})}
        onClick={() => handleGoBack()}
      >
        <ArrowBackIcon />
      </Fab>
      {publicationRequest.publicationsPublic && (
        <Button
          className="requestButton"
          disabled={hasIdentifiers || publicationRequest.noIdentifierGranted}
          variant="contained"
          color="primary"
          onClick={handleGrantAnId}
        >
          <FormattedMessage id="modal.issn.grandId" />
        </Button>
      )}
      {hasIdentifiers && (
        <Button
          className="requestButton"
          disabled={publicationRequest?.hasAssociatedMessage === true}
          variant="contained"
          color="primary"
          onClick={() =>
            handleSendMessage(
              publicationRequest.publicationIdentifierType?.toLowerCase()
            )
          }
        >
          <FormattedMessage id={publicationRequest?.hasAssociatedMessage === true ? 'messages.messageWasSent' : 'messages.sendMessage'} />
        </Button>
      )}
      <Button
        className="requestButton"
        disabled={hasIdentifiers}
        variant="contained"
        color="primary"
        onClick={() => setCopyModalIsOpen(true)}
      >
        <FormattedMessage id="request.publication.copy" />
      </Button>
      <Dialog
        open={copyModalIsOpen}
        onClose={() => setCopyModalIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="request.publication.copy.approve.title" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage id="request.publication.copy.approve.description" />
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialogButtons">
          <Button variant="contained" color="success" onClick={handleCopyRequest}>
            <FormattedMessage id="form.button.label.approve" />
          </Button>
          <Button variant="contained" color="error" onClick={() => setCopyModalIsOpen(false)}>
            <FormattedMessage id="form.button.label.cancel" />
          </Button>
        </DialogActions>
      </Dialog>
      {/* Modal for viewing MARC data */}
      <MarcPreviewModal
        url={`/api/isbn-registry/marc/${publicationRequest.id}`}
        method={'GET'}
        buttonLabelId={'form.button.label.previewMarc'}
        authenticationToken={authenticationToken}
      />

      <Button
        className="requestButton"
        variant="contained"
        color="primary"
        onClick={handleDownloadMarc}
      >
        <FormattedMessage id="form.button.label.downloadMarc" />
      </Button>

      <Button
        className="requestButton"
        disabled={melindaButtonIsDisabled()}
        variant="contained"
        color="primary"
        onClick={handleSaveToMelinda}
      >
        <FormattedMessage id="form.button.label.saveToMelinda" />
      </Button>

      {/* Pressing the delete button below causes opening of a confirmation Dialog */}
      <Fab
        disabled={!publicationRequest.noIdentifierGranted}
        color="warning"
        size="small"
        title={intl.formatMessage({id: 'form.button.label.delete'})}
        onClick={() => setDeleteModalIsOpen(true)}
      >
        <DeleteIcon />
      </Fab>

      {/* Show modal if Melinda api response is available */}
      <MelindaResponseModal
        apiResponse={melindaApiResponse}
        closeMelindaResponseModal={closeMelindaResponseModal}
        showModal={displayMelindaResponseDetails(melindaApiResponse)}
      />

      <Dialog
        open={deleteModalIsOpen}
        onClose={() => setDeleteModalIsOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="request.publisher.delete" />
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <FormattedMessage id="request.publisher.delete.approve" />
          </DialogContentText>
        </DialogContent>
        <DialogActions className="dialogButtons">
          <Button variant="contained" color="success" onClick={handleDeleteRequest}>
            <FormattedMessage id="form.button.label.approve" />
          </Button>
          <Button variant="contained" color="error" onClick={() => setDeleteModalIsOpen(false)}>
            <FormattedMessage id="form.button.label.cancel" />
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit mode button - On/Off */}
      <Fab
        color="secondary"
        size="small"
        title={intl.formatMessage({id: 'request.publication.edit'})}
        onClick={handleEditClick}
      >
        <EditIcon />
      </Fab>
    </>
  );
}

IsbnPublicationRequestButtonRow.propTypes = {
  publicationRequest: PropTypes.object.isRequired,
  setIdentifierType: PropTypes.func.isRequired,
  setIsGrantingIdentifiers: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setShowSpinner: PropTypes.func.isRequired
};

export default IsbnPublicationRequestButtonRow;
