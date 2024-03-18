import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage, useIntl} from 'react-intl';

import {
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Backdrop
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

import MarcPreviewModal from '/src/frontend/components/common/subComponents/modals/MarcPreviewModal.jsx';
import MelindaResponseModal from '/src/frontend/components/common/subComponents/modals/MelindaResponseModal.jsx';
import IssnGrantIdModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnGrantIdModal.jsx';
import IssnWithdrawIdModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnWithdrawIdModal.jsx';
import IssnPublicationArchiveModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationArchiveModal.jsx';

import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';

import {deleteEntry, makeApiRequest, downloadFile} from '/src/frontend/actions';
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import {formatFromAPI} from '/src/frontend/components/issn-registry/publications/utils';


function IssnPublicationDisplay(props) {
  const {
    children,
    issnPublication,
    setIsEdit,
    setIssnPublication,
    setLoading
  } = props;

  const intl = useIntl();
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // State for the spinner shown while saving to Melinda or downloading MARC
  const [showSpinner, setShowSpinner] = useState(false);
  const [melindaApiResponse, setMelindaApiResponse] = useState(null);

  /* Handles starting of the editing process */
  const handleEditClick = () => {
    setIsEdit(true);
  };


  /* Handles closing of the Save to Melinda spinner */
  function handleCloseBackdrop() {
    setLoading(false);
  }

  /* Handles deleting of the current publication */
  async function handleDeletePublication() {
    await deleteEntry({
      url: `/api/issn-registry/publications/${issnPublication.id}`,
      authenticationToken,
      history,
      redirectRoute: getRedirectRoute(),
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  /* Handles saving data to Melinda */
  async function handleSaveToMelinda() {
    setShowSpinner(true);
    const result = await makeApiRequest({
      url: `/api/issn-registry/marc/${issnPublication.id}/send-to-melinda`,
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

    // Display result in Modal
    setMelindaApiResponse(result);
  }

  function closeMelindaResponseModal() {
    setMelindaApiResponse(null);
  }

  // Handles starting of the granting an id process
  async function handleGrantIssn() {
    const updateResult = await makeApiRequest({
      url: `/api/issn-registry/publications/${issnPublication.id}/get-issn`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnPublication(formatFromAPI(updateResult));
    }
  }

  // Handles starting of the withdrawing an id process
  async function handleWithDrawIssn() {
    const updateResult = await makeApiRequest({
      url: `/api/issn-registry/publications/${issnPublication.id}/delete-issn`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnPublication(formatFromAPI(updateResult));
    }
  }

  /* Handles downloading marc data */
  async function handleDownloadMarc() {
    setShowSpinner(true);
    await downloadFile({
      url: `/api/issn-registry/marc/${issnPublication.id}?format=iso2709&download=true`,
      method: 'GET',
      authenticationToken,
      downloadName: `issnregistry-publication-${issnPublication.id}.mrc`
    });
    setShowSpinner(false);
  }

  // Display modal only if it would contain meaningful information
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

  // Handles the state of Melinda buttons (disabled/enabled)
  const publicationHasNoIssn = () => {
    return !issnPublication.issn || issnPublication.issn === '';
  };

  /* Handles redirecting to the right page after publication is deleted */
  function getRedirectRoute() {
    // When coming from single request page via publications modal - redirect back to single request page
    if (history.location.state?.requestId) {
      return `/issn-registry/requests/${history.location.state.requestId}`;
    }

    // When coming from publisher page via publications modal - redirect back to publisher page
    if (history.location.state?.publisherId) {
      return `/issn-registry/publishers/${history.location.state.publisherId}`;
    }

    // Otherwise redirect back to publications page (default)
    return '/issn-registry/publications';
  }

  /* Handles going back to the previous page */
  const handleGoBack = () => {
    // Keep search state if previous page was search page
    if (history.location.state?.searchBody) {
      return history.push({
        pathname: '/issn-registry/publications',
        state: {
          searchBody: history.location.state.searchBody
        }
      });
    }

    // Discard state since it was used already if necessary
    history.replace({state: {}});
    history.goBack();
  };

  return (
    <>
      <div className="issnPublicationButtonsContainer">
        <div>
          {/* Button for going back to the previous page */}
          <Fab
            color="secondary"
            size="small"
            title={intl.formatMessage({id: 'form.button.label.back'})}
            onClick={() => handleGoBack()}
          >
            <ArrowBackIcon />
          </Fab>

          {/* Modal for granting new ISSN ID */}
          {publicationHasNoIssn() && (
            <IssnGrantIdModal
              handleGrantIssn={handleGrantIssn}
              hasPublisher={issnPublication.publisherId !== null && issnPublication.publisherId !== 0}
            />
          )}

          {/* Modal for withdrawing existing ISSN ID */}
          {!publicationHasNoIssn() && (
            <IssnWithdrawIdModal
              handleWithdrawIssn={handleWithDrawIssn}
              id={issnPublication.id}
            />
          )}

          {/* Modal for viewing MARC data */}
          {!publicationHasNoIssn() && (
            <MarcPreviewModal
              url={`/api/issn-registry/marc/${issnPublication.id}`}
              method={'GET'}
              buttonLabelId={'form.button.label.previewMarc'}
              authenticationToken={authenticationToken}
            />
          )}

          {/* Button for downloading MARC data */}
          {!publicationHasNoIssn() && (
            <Button
              className="requestButton"
              variant="contained"
              color="primary"
              onClick={handleDownloadMarc}
            >
              <FormattedMessage id="form.button.label.downloadMarc" />
            </Button>
          )}

          {/* Button for saving data to Melinda */}
          <Button
            disabled={publicationHasNoIssn()}
            className="requestButton"
            variant="contained"
            color="primary"
            onClick={handleSaveToMelinda}
          >
            <FormattedMessage id="form.button.label.saveToMelinda" />
          </Button>

          {/* Modal for viewing Archive Record */}
          <IssnPublicationArchiveModal publicationId={issnPublication.id} />
        </div >

        <div>
          {/* Delete publication button. Pressing the button causes opening of a confirmation Dialog */}
          <Fab
            disabled={!publicationHasNoIssn()}
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
              <FormattedMessage id="publication.issn.delete" />
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <FormattedMessage id="publication.issn.delete.approve" />
              </DialogContentText>
            </DialogContent>
            <DialogActions className="dialogButtons">
              <Button variant="contained" color="success" onClick={handleDeletePublication}>
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
            title={intl.formatMessage({id: 'form.button.label.edit'})}
            onClick={handleEditClick}
          >
            <EditIcon />
          </Fab>
        </div>
      </div >
      {/* Show loading spinner during Saving to Melinda and downloading MARC */}
      <Backdrop open={showSpinner} onClick={handleCloseBackdrop} >
        <CircularProgress size={100} color="inherit" />
      </Backdrop >
      <div className="listItemSpinner">{children}</div>
    </>
  );
}

IssnPublicationDisplay.propTypes = {
  children: PropTypes.node.isRequired,
  issnPublication: PropTypes.object.isRequired,
  setLoading: PropTypes.func.isRequired,
  setIssnPublication: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired
};

export default IssnPublicationDisplay;
