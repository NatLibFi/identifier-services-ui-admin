import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {useAuth} from 'react-oidc-context';
import {FormattedMessage, useIntl} from 'react-intl';
import {useHistory} from 'react-router-dom';

import {
  Button,
  Fab,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

// Hooks
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

// Actions
import {deleteEntry} from '/src/frontend/actions';

// Modals
import IssnMessagesModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnMessagesModal.jsx';
import IssnPublicationsModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationsModal.jsx';
import IssnPublishersRequestsModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublishersRequestsModal.jsx';


function IssnPublisherDisplay(props) {
  const {
    children,
    issnPublisher,
    setIsEdit
  } = props;

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const intl = useIntl();
  const history = useHistory();

  const {user: {access_token: authenticationToken}} = useAuth();
  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  async function handleDeletePublisher() {
    await deleteEntry({
      url: `/api/issn-registry/publishers/${issnPublisher.id}`,
      authenticationToken,
      history,
      redirectRoute: '/issn-registry/publishers',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleGoBack = () => {
    // Keep search state if previous page was search page
    if (history.location.state?.searchBody) {
      return history.push({
        pathname: '/issn-registry/publishers',
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
      <div className="issnPublisherButtonsContainer">
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.back'})}
          onClick={() => handleGoBack()}
        >
          <ArrowBackIcon />
        </Fab>
        {/* Modal for viewing publishers requests */}
        <IssnPublishersRequestsModal publisher={issnPublisher} />
        {/* Modal for viewing publishers publications */}
        <IssnPublicationsModal
          searchAttribute={'publisherId'}
          searchValue={issnPublisher.id}
          publisherName={issnPublisher.officialName}
        />
        {/* Modal for viewing publishers messages */}
        <IssnMessagesModal
          searchAttribute={'publisherId'}
          searchValue={issnPublisher.id}
          publisherName={issnPublisher.officialName}
        />
        {/* Pressing the delete button below causes opening of a confirmation Dialog */}
        <Fab
          disabled={issnPublisher.formId !== null && issnPublisher.formId !== 0}
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
            <FormattedMessage id="publisher.issn.delete" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="publisher.issn.delete.approve" />
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialogButtons">
            <Button variant="contained" color="success" onClick={handleDeletePublisher}>
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
      {children}
    </>
  );
}

IssnPublisherDisplay.propTypes = {
  children: PropTypes.node.isRequired,
  issnPublisher: PropTypes.object.isRequired,
  setIsEdit: PropTypes.func.isRequired
};

export default IssnPublisherDisplay;
