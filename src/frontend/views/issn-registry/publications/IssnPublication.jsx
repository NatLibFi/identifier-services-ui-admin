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

import useItem from '/src/frontend/hooks/useItem';
import {
  deleteEntry,
  updateEntry,
  makeApiRequest,
  downloadFile
} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import MarcPreviewModal from '/src/frontend/components/common/subComponents/modals/MarcPreviewModal.jsx';
import MelindaResponseModal from '/src/frontend/components/common/subComponents/modals/MelindaResponseModal.jsx';
import IssnGrantIdModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnGrantIdModal.jsx';
import IssnWithdrawIdModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnWithdrawIdModal.jsx';
import IssnPublicationArchiveModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationArchiveModal.jsx';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import IssnPublicationDataComponent from '/src/frontend/components/issn-registry/publications/IssnPublicationDataComponent.jsx';
import {validate} from '/src/frontend/components/issn-registry/publications/validate';
import {formatFromAPI, formatToApi} from '/src/frontend/components/issn-registry/publications/utils';

function IssnPublication(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const intl = useIntl();
  const {id} = match.params;

  const [failedUpdateCount, setFailedUpdateCount] = useState(0); // Dirty quickfix for state bug
  const [issnPublication, setIssnPublication] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // State for the spinner shown while saving to Melinda or downloading MARC
  const [showSpinner, setShowSpinner] = useState(false);
  const [melindaApiResponse, setMelindaApiResponse] = useState(null);

  // Fetching data of the current publication
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/issn-registry/publications/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id, failedUpdateCount],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setIssnPublication(formatFromAPI(initialData));

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  /* Handles starting of the editing process */
  const handleEditClick = () => {
    setIsEdit(true);
  };

  /* Handles canceling of the editing process */
  const handleCancel = () => {
    setIsEdit(false);
  };

  /* Handles closing of the Save to Melinda spinner */
  function handleCloseBackdrop () {
    setLoading(false);
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

  /* Handles updating of the current publication */
  async function handleUpdatePublication(values) {
    const formattedValues = formatToApi(values);
    const updateResult = await updateEntry({
      url: `/api/issn-registry/publications/${id}`,
      values: formattedValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnPublication(formatFromAPI(updateResult));
      setIsEdit(false);
      return true;
    }

    // Quickfix to the state bug. A new request is made to avoid having situation where
    // view is not in sync with database state
    const newFailedUpdateCount = failedUpdateCount + 1;
    setFailedUpdateCount(newFailedUpdateCount);
  }

  /* Handles deleting of the current publication */
  async function handleDeletePublication() {
    await deleteEntry({
      url: `/api/issn-registry/publications/${id}`,
      authenticationToken,
      history,
      redirectRoute: '/issn-registry/publications',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  /* Handles saving data to Melinda */
  async function handleSaveToMelinda() {
    setShowSpinner(true);
    const result = await makeApiRequest({
      url: `/api/issn-registry/marc/${id}/send-to-melinda`,
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
      url: `/api/issn-registry/publications/${id}/get-issn`,
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
      url: `/api/issn-registry/publications/${id}/delete-issn`,
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

  // Handles the state of Melinda buttons (disabled/enabled)
  const publicationHasNoIssn = () => {
    return !issnPublication.issn || issnPublication.issn === '';
  };

  // Display modal only if it would contain meaningful information
  function displayMelindaResponseDetails(apiResponse) {
    if(!apiResponse || typeof apiResponse !== 'object') {
      return false;
    }

    const numSystemErrors = apiResponse?.errors?.length;
    const numRecordErrors = apiResponse?.records?.filter(({recordStatus}) => recordStatus !== 'CREATED').length;

    if(numSystemErrors === undefined || numRecordErrors === undefined) {
      return false;
    }

    if(numSystemErrors > 0 || numRecordErrors > 0) {
      return true;
    }

    return false;
  }

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

  // Required to avoid textField focus issues on edit
  const dataComponent = (
    <IssnPublicationDataComponent
      issnPublication={issnPublication}
      isEdit={isEdit}
      updatePublication={handleUpdatePublication}
    />
  );

  return (
    <>
      <Typography variant="h5" className="titleTopSticky">
        {issnPublication?.title ?? ''} - ISSN-
        <FormattedMessage id="common.publicationDetails" />
      </Typography>
      {isEdit ? (
        <div className="listItem">
          <Form
            onSubmit={handleUpdatePublication}
            initialValues={issnPublication}
            validate={validate}
          >
            {({handleSubmit, valid}) => (
              <form onSubmit={handleSubmit}>
                <div className="btnContainer">
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
                <div className="listItemSpinner">{dataComponent}</div>
              </form>
            )}
          </Form>
        </div>
      ) : (
        <div className="listItem">
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
                  grantIssnPublicationId={handleGrantIssn}
                  id={id}
                  token={authenticationToken}
                  history={history}
                  publisherId={issnPublication.publisherId?.toString()}
                />
              )}

              {/* Modal for withdrawing existing ISSN ID */}
              {!publicationHasNoIssn() && (
                <IssnWithdrawIdModal
                  withdrawIssnPublicationId={handleWithDrawIssn}
                  id={id}
                  token={authenticationToken}
                  history={history}
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
              <IssnPublicationArchiveModal
                publicationId={issnPublication.id}
                {...props}
              />
            </div>

            <div>
              {/* Delete publication button. Pressing the button causes opening of a confirmation Dialog */}
              <Fab
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
                <DialogActions>
                  <Button onClick={() => setDeleteModalIsOpen(false)}>
                    <FormattedMessage id="form.button.label.cancel" />
                  </Button>
                  <Button onClick={handleDeletePublication}>
                    <FormattedMessage id="form.button.label.approve" />
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
          </div>
          {/* Show loading spinner during Saving to Melinda and downloading MARC */}
          <Backdrop open={showSpinner} onClick={handleCloseBackdrop}>
            <CircularProgress size={100} color="inherit" />
          </Backdrop>
          <div className="listItemSpinner">{dataComponent}</div>
        </div>
      )}
    </>
  );
}

IssnPublication.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IssnPublication);
