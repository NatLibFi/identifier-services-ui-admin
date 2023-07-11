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
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

import useItem from '/src/frontend/hooks/useItem';
import {deleteEntry, updateEntry} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import IssnMessagesModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnMessagesModal.jsx';
import IssnPublicationsModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationsModal.jsx';
import IssnPublisherCreationModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublisherCreationModal.jsx';
import IssnPublicationCreationModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationCreationModal.jsx';
import IssnRequestArchiveModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnRequestArchiveModal.jsx';

import IssnRequestDataComponent from '/src/frontend/components/issn-registry/publicationRequests/IssnRequestDataComponent.jsx';
import {validate} from '/src/frontend/components/issn-registry/publicationRequests/validate';

function IssnRequest(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const intl = useIntl();
  const {id} = match.params;

  const [issnRequest, setIssnRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // Fetching data of the current request
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/issn-registry/requests/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [authenticationToken, id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setIssnRequest(initialData);

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

  /* Handles going back to the previous page */
  const handleGoBack = () => {
    // Keep search state if previous page was search page
    if (history.location.state?.searchBody) {
      return history.push({
        pathname: '/issn-registry/requests',
        state: {
          searchBody: history.location.state.searchBody
        }
      });
    }

    // Discard state since it was used already if necessary
    history.replace({state: {}});
    history.goBack();
  };

  /* Handles updating of the current request */
  async function handlePublicationRequestUpdate(values) {
    // publisher id should not be sent to the API
    const {publisherId, publisherName, ...updateValues} = values; // eslint-disable-line no-unused-vars

    const updateResult = await updateEntry({
      url: `/api/issn-registry/requests/${id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnRequest(updateResult);
    }

    setIsEdit(false);
  }

  /* Handles deleting of the current request */
  async function handleDeleteRequest() {
    await deleteEntry({
      url: `/api/issn-registry/requests/${id}`,
      authenticationToken,
      history,
      redirectRoute: '/issn-registry/requests',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  /* Send message button is disabled when the status of the request is 'NOT_HANDLED' or 'REJECTED' */
  const sendMessageButtonIsDisabled = () => {
    return issnRequest.status === 'NOT_HANDLED' || issnRequest.status === 'REJECTED';
  };

  /* Handles sending of a message to the publisher */
  const handleSendMessage = () => {
    history.push({
      pathname: '/issn-registry/messages/form/send',
      state: {
        messageCode: 'form_handled',
        langCode: issnRequest.langCode,
        formId: issnRequest.id,
        publisherId: issnRequest.publisherId
      }
    });
  };

  // Required to avoid textField focus issues on edit
  const dataComponent = (
    <IssnRequestDataComponent
      issnRequest={issnRequest}
      setIssnRequest={setIssnRequest}
      isEdit={isEdit}
      {...props}
    />
  );

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
      <>
        <Typography variant="h5" className="titleTopSticky">
          {issnRequest.publisher ?? ''} - ISSN-
          <FormattedMessage id="common.requestDetails" />
        </Typography>
        <div className="listItem">
          <Form
            onSubmit={handlePublicationRequestUpdate}
            initialValues={issnRequest}
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
      </>
    );
  }

  return (
    <>
      <Typography variant="h5" className="titleTopSticky">
        {issnRequest.publisher ?? ''} - ISSN-
        <FormattedMessage id="common.requestDetails" />
      </Typography>
      <div className="listItem">
        <div className="requestButtonsContainer">
          <Fab
            color="secondary"
            size="small"
            title={intl.formatMessage({id: 'form.button.label.back'})}
            onClick={() => handleGoBack()}
          >
            <ArrowBackIcon />
          </Fab>
          {/* Modal for creating new publishers */}
          <IssnPublisherCreationModal
            disabled={issnRequest.publisherCreated || Boolean(issnRequest.publisherId)}
            formId={issnRequest.id}
            publisherName={issnRequest.publisher}
            {...props}
          />
          {/* Modal for creating new publications */}
          <IssnPublicationCreationModal formId={issnRequest.id} {...props} />
          {/* Send message */}
          <Button
            className="requestButton"
            variant="outlined"
            color="primary"
            disabled={sendMessageButtonIsDisabled()}
            onClick={() => handleSendMessage()}
          >
            {<FormattedMessage id="messages.sendMessage" />}
          </Button>
          {/* Modal for viewing publishers publications */}
          <IssnPublicationsModal
            searchAttribute={'formId'}
            searchValue={issnRequest.id}
            {...props}
          />
          {/* Modal for viewing publishers messages */}
          <IssnMessagesModal
            searchAttribute={'formId'}
            searchValue={issnRequest.id}
            {...props}
          />

          {/* Modal for viewing Archive Record */}
          <IssnRequestArchiveModal formId={issnRequest.id} {...props} />

          {/* Pressing the delete button below causes opening of a confirmation Dialog */}
          <Fab
            // Delete button is disabled if any publication linked to the request has an identifier
            disabled={issnRequest.publicationCountIssn > 0}
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
          {/* Edit mode - On/Off */}
          <Fab
            color="secondary"
            size="small"
            title={intl.formatMessage({id: 'form.button.label.edit'})}
            onClick={handleEditClick}
          >
            <EditIcon />
          </Fab>
        </div>
        <div className="listItemSpinner">{dataComponent}</div>
      </div>
    </>
  );
}

IssnRequest.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IssnRequest);
