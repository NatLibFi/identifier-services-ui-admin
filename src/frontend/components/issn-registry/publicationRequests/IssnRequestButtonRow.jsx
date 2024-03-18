import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';

import {useHistory} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {FormattedMessage, useIntl} from 'react-intl';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import {deleteEntry} from '/src/frontend/actions';

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

import IssnMessagesModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnMessagesModal.jsx';
import IssnPublicationsModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationsModal.jsx';
import IssnPublisherCreationModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublisherCreationModal.jsx';
import IssnPublicationCreationModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationCreationModal.jsx';
import IssnRequestArchiveModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnRequestArchiveModal.jsx';


function IssnRequestButtonRow(props) {
  const {
    issnRequest,
    setIsEdit
  } = props;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const intl = useIntl();
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  /* Handles starting of the editing process */
  const handleEditClick = () => {
    setIsEdit(true);
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

  /* Handles deleting of the current request */
  async function handleDeleteRequest() {
    await deleteEntry({
      url: `/api/issn-registry/requests/${issnRequest.id}`,
      authenticationToken,
      history,
      redirectRoute: '/issn-registry/requests',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  /* Send message button is disabled when the status of the request is 'NOT_HANDLED' or 'REJECTED' */
  const sendMessageButtonIsDisabled = useCallback(() => {
    return issnRequest.status === 'NOT_HANDLED' || issnRequest.status === 'REJECTED';
  }, []);

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


  return (
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
        publisher={issnRequest.publisher}
      />
      {/* Modal for creating new publications */}
      <IssnPublicationCreationModal formId={issnRequest.id} />
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
        publisherName={issnRequest.publisherName}
      />
      {/* Modal for viewing publishers messages */}
      <IssnMessagesModal
        searchAttribute={'formId'}
        searchValue={issnRequest.id}
        publisherName={issnRequest.publisherName}
      />

      {/* Modal for viewing Archive Record */}
      <IssnRequestArchiveModal formId={issnRequest.id} />

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
        <DialogActions className="dialogButtons">
          <Button variant="contained" color="success" onClick={handleDeleteRequest}>
            <FormattedMessage id="form.button.label.approve" />
          </Button>
          <Button variant="contained" color="error" onClick={() => setDeleteModalIsOpen(false)}>
            <FormattedMessage id="form.button.label.cancel" />
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
  );
}

IssnRequestButtonRow.propTypes = {
  issnRequest: PropTypes.object.isRequired,
  setIsEdit: PropTypes.func.isRequired
};

export default IssnRequestButtonRow;
