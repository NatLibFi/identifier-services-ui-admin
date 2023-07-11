/**
 *
 * @licstart  The following is the entire license notice for the JavaScript code in this file.
 *
 * Admin UI service of Identifier Services system
 *
 * Copyright (C) 2023 University Of Helsinki (The National Library Of Finland)
 *
 * This file is part of identifier-services-ui-admin
 *
 * identifier-services-ui-admin program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * identifier-services-ui-admin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this file.
 *
 */

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Form} from 'react-final-form';
import {withRouter} from 'react-router-dom';
import {useIntl, FormattedMessage} from 'react-intl';

import {
  Fab,
  Button,
  Typography,
  Box,
  Modal,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BookIcon from '@mui/icons-material/Book';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

import useItem from '/src/frontend/hooks/useItem';
import {redirect} from '/src/frontend/actions/util';

import {
  deleteEntry,
  downloadFile,
  makeApiRequest,
  updateEntry
} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import {
  electronicFormats,
  printFormats,
  authorRoles,
  MESSAGE_CODES,
  PUBLICATION_TYPES
} from '/src/frontend/components/common/form/constants';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import MarcPreviewModal from '/src/frontend/components/common/subComponents/modals/MarcPreviewModal.jsx';
import FormEditErrorCard from '/src/frontend/components/isbn-registry/subComponents/cards/FormEditErrorCard.jsx';

import IsbnPublicationRequestDataComponent from '/src/frontend/components/isbn-registry/publicationRequests/IsbnPublicationRequestDataComponent.jsx';
import {validate} from '/src/frontend/components/isbn-registry/publicationRequests/validate';
import {formatPublicationValues, formatPublicationRequestValues} from '/src/frontend/components/isbn-registry/publicationRequests/utils';

function IsbnPublicationRequest(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const intl = useIntl();

  const {id} = match.params;

  const [publicationRequest, setPublicationRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [copyModalIsOpen, setCopyModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // State for selecting the type of an id to be granted
  const [identifierType, setIdentifierType] = useState('');

  // State for the modal window for generating identifierbatch for the publication
  const [open, setOpen] = useState(false);
  const [isGrantingIdentifiers, setIsGrantingIdentifiers] = useState(false);

  // Fetching data of the current request
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/requests/publications/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [authenticationToken, id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setPublicationRequest(initialData);

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  /* Handles updating of the confirmed publication request */
  async function handlePublicationRequestUpdate(values) {
    // Check whether the publication is a confirmed publication or a publication request
    const publicationIsConfirmed =
      values.publicationIdentifierPrint !== '' ||
      values.publicationIdentifierElectronical !== '';

    // Use different format function depending on the publication status (confirmed or not)
    const updateValues = publicationIsConfirmed
      ? formatPublicationValues(values)
      : formatPublicationRequestValues(values);

    const updateResult = await updateEntry({
      url: `/api/isbn-registry/requests/publications/${id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setPublicationRequest(updateResult);
    }

    setIsEdit(false);
  }

  /* Handles starting of the editing process */
  function handleEditClick() {
    setIsEdit(true);
  }

  /* Handles canceling of the editing process */
  function handleCancel() {
    setIsEdit(false);
  }

  /* Handles going back to the previous page */
  function handleGoBack() {
    if (history.location?.state?.redirectFromPublicationModal) {
      history.push({
        pathname: history.location.state.redirectFromPublicationModal
      },{});
    } else {
      history.push({
        pathname: '/isbn-registry/requests/publications',
        state: {searchBody: history.location.state.searchBody}
      });
    }
  }

  // Handles starting of the granting an id process
  const handleGrantAnId = () => {
    const identifierTypeValue =
      publicationRequest.publicationType === PUBLICATION_TYPES.SHEET_MUSIC
        ? 'ismn'
        : 'isbn';
    setIdentifierType(identifierTypeValue);
    setIsGrantingIdentifiers(true);
  };

  // Handles canceling of the granting an id process
  const handleCancelGrantAnId = () => {
    setIsGrantingIdentifiers(false);
    setIdentifierType('');
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

  async function handleSaveToMelinda() {
    // eslint-disable-line
    const result = await makeApiRequest({
      url: `/api/isbn-registry/marc/${id}/send-to-melinda`,
      method: 'POST',
      authenticationToken
    });

    if (!result) {
      setSnackbarMessage({
        severity: 'error',
        message: 'Melindaan tallentaminen ei onnistunut. Ota yhteyttä sovellusylläpitoon.'
      });
      return;
    }

    // Snackbar messages interpretation is here since result needs to be interpreted
    if (result.errors !== 0) {
      setSnackbarMessage({
        severity: 'error',
        message:
          'Melindaan tallennuksen aikana tapahtui virheitä. Kaikkia tietueita ei välttämättä tallennettu'
      });
      return;
    }

    if (
      result.records.length ===
      result.records.filter((r) => r.recordStatus === 'DUPLICATE').length
    ) {
      const melindaIds = result.records
        .filter((r) => r.ids && r.ids.length > 0)
        .map((r) => r.ids)
        .flat()
        .join(', ');
      setSnackbarMessage({
        severity: 'error',
        message: `Tietuetta ei tallennettu, löytyi jo Melindasta ks. id: ${melindaIds}`
      });
      return;
    }

    if (
      result.records.length > 0 &&
      result.records.filter((r) => r.recordStatus === 'DUPLICATE').length > 0
    ) {
      setSnackbarMessage({
        severity: 'error',
        message:
          'Osaa tietueista ei tallennettu, koska näitä vastaavat tietueet löytyivät jo Melindasta.'
      });
      return;
    }

    if (
      result.records.length ===
      result.records.filter((r) => r.recordStatus === 'CREATED').length
    ) {
      setSnackbarMessage({
        severity: 'success',
        message: 'Melindaan tallentaminen onnistui'
      });
      return;
    }

    // Inform users that we are not entirely sure what has happened
    setSnackbarMessage({
      severity: 'error',
      message:
        'Kävi savolaisittain: saattaa olla, että Melindaan tallentaminen joiltain osin onnistui tai saattaa olla, että ei onnistunut'
    });
  }

  // Handles granting an id
  async function handleSubmitAnId() {
    const url = `/api/isbn-registry/identifierbatches/${identifierType}`;
    const values = {publisherId: publicationRequest.publisherId, publicationId: id};
    const redirectRoute = `/isbn-registry/requests/publications/${id}`;

    await makeApiRequest({
      url,
      method: 'POST',
      values,
      authenticationToken,
      history,
      redirectRoute,
      setSnackbarMessage
    });

    handleCloseModal();
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
        publicationId: id,
        identifierBatchId: publicationRequest.identifierBatchId
      }
    });
  };

  // Handles downloading marc data
  async function handleDownloadMarc() {
    await downloadFile({
      url: `/api/isbn-registry/marc/${publicationRequest.id}?format=iso2709&download=true`,
      method: 'GET',
      authenticationToken,
      downloadName: `isbnregistry-publication-${publicationRequest.id}.mrc`
    });
  }

  // Click handlers for the modal window for approving granting an id
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  // Check if the request has been already granted an id
  const hasIdentifiers = () => {
    if (
      !publicationRequest.publicationIdentifierPrint &&
      !publicationRequest.publicationIdentifierElectronical
    ) {
      return false;
    }

    return (
      publicationRequest.publicationIdentifierPrint.length > 0 ||
      publicationRequest.publicationIdentifierElectronical.length > 0
    );
  };

  /* Handles deleting of the current request */
  async function handleDeleteRequest() {
    await deleteEntry({
      url: `/api/isbn-registry/requests/publications/${id}`,
      authenticationToken,
      history,
      redirectRoute: '/isbn-registry/requests/publications',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  // Handles the state of "Save to Melinda"-button (disabled/enabled)
  const melindaButtonIsDisabled = () => {
    // eslint-disable-line
    if (hasIdentifiers()) return false; // If identifiers have been granted, setup is ok for taking information to Melinda
    if (publicationRequest.noIdentifierGranted) return true;
    if (!publicationRequest.publicationsPublic) return true;
    if (publicationRequest.publicationsIntra) return true;

    return false;
  };

  // Declaring a variable to store the current component's content
  const dataComponent = (
    <IsbnPublicationRequestDataComponent
      currentRequest={publicationRequest}
      setPublicationRequest={setPublicationRequest}
      isEdit={isEdit}
      authenticationToken={authenticationToken}
      hasIdentifiers={hasIdentifiers()}
      {...props}
    />
  );

  const EditForm = () => {
    // Get translation label for each option
    function formatValue(value, options) {
      const formattedValue = value
        ? value
          .map(item => options.find(option => option.value === item))
          .map(item => ({label: intl.formatMessage({id: item.label}), value: item.value}))
        : [];

      return formattedValue;
    }

    // Format initial values for the edit form
    function formatInitialValues(values) {
      if (values && Object.keys(values).length > 0) {
        const formattedValues = {
          ...values,
          fileformat: formatValue(values.fileformat, electronicFormats),
          printFormat: formatValue(values.type, printFormats),
          role1: formatValue(values.role1, authorRoles),
          role2: formatValue(values.role2, authorRoles),
          role3: formatValue(values.role3, authorRoles),
          role4: formatValue(values.role4, authorRoles)
        };
        return formattedValues;
      }

      return {};
    }

    return (
      <Form
        onSubmit={handlePublicationRequestUpdate}
        validate={validate}
        initialValues={formatInitialValues(publicationRequest)}
      >
        {({handleSubmit, valid, errors}) => (
          <form onSubmit={handleSubmit}>
            <div className="updateContainer">
              <div className="updateButtonsContainer">
                <Button onClick={handleCancel}>
                  <FormattedMessage id="form.button.label.cancel" />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!valid}
                >
                  <FormattedMessage id="form.button.label.update" />
                </Button>
              </div>
              {/* Display an error message if the form is not valid */}
              <FormEditErrorCard valid={valid} errors={errors} />
            </div>
            <div className="listItemSpinner">{dataComponent}</div>
          </form>
        )}
      </Form>
    );
  };

  const component = setComponent();

  function setComponent() {
    if (error) {
      return (
        <Typography variant="h2" className="normalTitle">
          <FormattedMessage id="errorPage.message.defaultError" />
        </Typography>
      );
    }

    if (loading) {
      return <Spinner />;
    }

    if (isEdit) {
      return (
        <div className="listItem">
          <Typography variant="h5" className="titleTopSticky">
            {publicationRequest?.title ?? ''} -{' '}
            {publicationRequest?.publicationType !== PUBLICATION_TYPES.SHEET_MUSIC
              ? 'ISBN'
              : 'ISMN'}
          -
            <FormattedMessage id="common.requestDetails" />
          </Typography>
          <EditForm />
        </div>
      );
    }

    return(
      <div className="listItem">
        <Typography variant="h5" className="titleTopSticky">
          {publicationRequest?.title ?? ''} -{' '}
          {publicationRequest?.publicationType !== PUBLICATION_TYPES.SHEET_MUSIC
            ? 'ISBN'
            : 'ISMN'}
          -
          <FormattedMessage id="common.requestDetails" />
        </Typography>
        <div className="requestButtonsContainer">
          {isGrantingIdentifiers ? (
            <div className="grantAnIdButtonsContainer">
              <Button variant="contained" color="error" onClick={handleCancelGrantAnId}>
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={
                  identifierType ? (
                    identifierType === 'isbn' ? (
                      <BookIcon />
                    ) : (
                      <MusicNoteIcon />
                    )
                  ) : null
                }
                disabled={!identifierType}
                onClick={handleOpenModal}
              >
                {identifierType ? (
                  identifierType === 'isbn' ? (
                    <FormattedMessage
                      id="form.button.label.grant"
                      values={{type: 'ISBN'}}
                    />
                  ) : (
                    <FormattedMessage
                      id="form.button.label.grant"
                      values={{type: 'ISMN'}}
                    />
                  )
                ) : (
                  <FormattedMessage id="form.button.label.submit" />
                )}
              </Button>
              <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                onClose={handleCloseModal}
              >
                <Box className="grantAnIdModal">
                  <Typography variant="h5">
                    Valittu julkaisija: {publicationRequest.publisherName}
                  </Typography>
                  <Typography variant="h5">
                    <FormattedMessage id="request.publication.grantId" />
                  </Typography>
                  {[...publicationRequest.fileformat].map((v) => (
                    <Typography key={v}>
                      <em>
                        <FormattedMessage id={`form.fileFormat.${v.toLowerCase()}`} />
                      </em>
                    </Typography>
                  ))}
                  <br />
                  {[...publicationRequest.type].map((v) => (
                    <Typography key={v}>
                      <em>
                        <FormattedMessage id={`form.printFormat.${v.toLowerCase()}`} />
                      </em>
                    </Typography>
                  ))}
                  <div>
                    <Button variant="contained" color="error" onClick={handleCloseModal}>
                      <FormattedMessage id="form.button.label.reject" />
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSubmitAnId}
                    >
                      <FormattedMessage id="form.button.label.approve" />
                    </Button>
                  </div>
                </Box>
              </Modal>
            </div>
          ) : (
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
                  disabled={hasIdentifiers() || publicationRequest.noIdentifierGranted}
                  variant="contained"
                  color="primary"
                  onClick={handleGrantAnId}
                >
                  <FormattedMessage id="modal.issn.grandId" />
                </Button>
              )}
              {hasIdentifiers() && (
                <Button
                  className="requestButton"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleSendMessage(
                      publicationRequest.publicationIdentifierType?.toLowerCase()
                    )
                  }
                >
                  <FormattedMessage id="messages.sendMessage" />
                </Button>
              )}
              <Button
                className="requestButton"
                disabled={hasIdentifiers()}
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
                <DialogActions>
                  <Button onClick={() => setCopyModalIsOpen(false)}>
                    <FormattedMessage id="form.button.label.cancel" />
                  </Button>
                  <Button onClick={handleCopyRequest}>
                    <FormattedMessage id="form.button.label.approve" />
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
                <DialogActions>
                  <Button onClick={() => setDeleteModalIsOpen(false)}>
                    <FormattedMessage id="form.button.label.cancel" />
                  </Button>
                  <Button onClick={handleDeleteRequest}>
                    <FormattedMessage id="form.button.label.approve" />
                  </Button>
                </DialogActions>
              </Dialog>

              <Fab
                color="secondary"
                size="small"
                title={intl.formatMessage({id: 'request.publication.edit'})}
                onClick={handleEditClick}
              >
                <EditIcon />
              </Fab>
            </>
          )}
        </div>
        <div className="listItemSpinner">{dataComponent}</div>
      </div>
    );
  }

  return component;
}

IsbnPublicationRequest.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IsbnPublicationRequest);
