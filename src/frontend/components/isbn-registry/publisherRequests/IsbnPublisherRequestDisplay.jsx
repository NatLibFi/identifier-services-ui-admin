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

import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage, useIntl} from 'react-intl';
import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import PublisherIdCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublisherIdCreationModal.jsx';
import IsbnPublisherArchiveEntryModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublisherArchiveEntryModal.jsx';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import {deleteEntry} from '/src/frontend/actions';

function IsbnPublisherRequestDisplay({publisherRequest, handleEditClick, children}) {
  const intl = useIntl();
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  /* Handles going back to the previous page */
  const handleGoBack = () => {
    history.push({
      pathname: '/isbn-registry/requests/publishers',
      state: {
        // Sending the search input value back to the list page
        searchBody: history.location.state.searchBody
      }
    });
  };

  /* Handles deleting of the current publisher request */
  async function handleDeleteRequest() {
    await deleteEntry({
      url: `/api/isbn-registry/requests/publishers/${publisherRequest.id}`,
      authenticationToken,
      history,
      redirectRoute: '/isbn-registry/requests/publishers',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  return (
    <>
      <div className="publisherButtonsContainer">
        <div className="publisherRequestButtonsInnerContainer">
          <Fab
            color="secondary"
            size="small"
            title={intl.formatMessage({id: 'form.button.label.back'})}
            onClick={() => handleGoBack()}
          >
            <ArrowBackIcon />
          </Fab>
          <PublisherIdCreationModal
            publisherId={publisherRequest.id}
            authenticationToken={authenticationToken}
            setSnackbarMessage={setSnackbarMessage}
          />
          {/* Modal for viewing archive entry of publisher request (note, it's same entity as publisher archive record and thus same component) */}
          <IsbnPublisherArchiveEntryModal
            publisherId={publisherRequest.id}
            authenticationToken={authenticationToken}
          />
        </div>
        <div>
          {/* Pressing the delete button below causes opening of a confirmation Dialog */}
          <Fab
            disabled={
              publisherRequest.activeIdentifierIsbn !== '' ||
              publisherRequest.activeIdentifierIsmn !== ''
            }
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
      <div>{children}</div>
    </>
  );
}

IsbnPublisherRequestDisplay.propTypes = {
  publisherRequest: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default IsbnPublisherRequestDisplay;
