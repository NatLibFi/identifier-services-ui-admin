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

import React from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage, useIntl} from 'react-intl';
import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';

import {Button, Fab} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Actions
import {downloadFile} from '/src/frontend/actions';

// Modals
import IsbnPublishersMessagesModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublishersMessagesModal.jsx';
import PublisherIdCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublisherIdCreationModal.jsx';
import PublisherListCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublisherListCreationModal.jsx';
import IsbnPublishersPublicationsModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublishersPublicationsModal.jsx';
import PublishersBatchIdsModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublishersBatchIdsModal.jsx';
import IsbnPublisherArchiveEntryModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublisherArchiveEntryModal.jsx';

// Hooks
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

// Constants
import {MESSAGE_CODES} from '/src/frontend/components/common/form/constants';


function IsbnPublisherDisplay({publisher, handleEditClick, children}) {
  const intl = useIntl();
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  // Lengths of active identifiers are used to determine if the message sending buttons should be shown
  const activeIsbnIdentifierCategory =
    publisher.activeIdentifierIsbn?.length > 0
      ? publisher.activeIdentifierIsbn.split('-')[2].length
      : 0;
  const activeIsmnIdentifierCategory =
    publisher.activeIdentifierIsmn?.length > 0
      ? publisher.activeIdentifierIsmn.split('-')[2].length
      : 0;

  const handleSendSubrangeMessage = (type) => {
    const messageCode =
      type === 'isbn'
        ? MESSAGE_CODES.SEND_SUBRANGE_ISBN
        : MESSAGE_CODES.SEND_SUBRANGE_ISMN;

    // Push to page to craft email message
    history.push({
      pathname: '/isbn-registry/messages/form/send',
      state: {
        messageCode,
        langCode: publisher.langCode,
        publisherId: publisher.id
      }
    });
  };

  /* Handles going back to the previous page */
  const handleGoBack = () => {
    history.push({
      pathname: '/isbn-registry/publishers',
      state: {
        // Sending the search input value back to the list page
        searchBody: history.location.state.searchBody
      }
    });
  };

  const handleDownloadPublisherInformationPackage = async () => {
    await downloadFile({
      url: '/api/isbn-registry/publishers/get-information-package',
      method: 'POST',
      requestBody: {publisherId: publisher.id, format: 'xlsx'},
      authenticationToken,
      downloadName: `publisher-${publisher.id}-information.xlsx`
    });
  };

  return (
    <>
      <div className="publisherButtonsContainer">
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.back'})}
          onClick={() => handleGoBack()}
        >
          <ArrowBackIcon />
        </Fab>
        <div className="publisherButtonsInnerContainer">
          {/* Modals for adding id's and batches */}
          <PublisherIdCreationModal
            publisherId={publisher.id}
            authenticationToken={authenticationToken}
            setSnackbarMessage={setSnackbarMessage}
          />
          <PublisherListCreationModal
            publisher={publisher}
            history={history}
            authenticationToken={authenticationToken}
            setSnackbarMessage={setSnackbarMessage}
          />
          {/* Send ISBN Subrange information for category 5 ISBN subranges */}
          {activeIsbnIdentifierCategory === 5 && (
            <Button
              className="buttons"
              variant="outlined"
              color="primary"
              onClick={() => handleSendSubrangeMessage('isbn')}
            >
              <FormattedMessage
                id="publisherRegistry.publisher.sendMessage"
                values={{type: 'ISBN', category: '5'}}
              />
            </Button>
          )}
          {/* Send ISMN Subrange information for category 7 ISMN subranges */}
          {activeIsmnIdentifierCategory === 7 && (
            <Button
              className="buttons"
              variant="outlined"
              color="primary"
              onClick={() => handleSendSubrangeMessage('ismn')}
            >
              <FormattedMessage
                id="publisherRegistry.publisher.sendMessage"
                values={{type: 'ISMN', category: '7'}}
              />
            </Button>
          )}
          {/* Modal for viewing publishers messages */}
          <IsbnPublishersMessagesModal
            publisher={publisher}
            authenticationToken={authenticationToken}
            history={history}
          />
          {/* Modal for viewing publishers publications (accepted) */}
          <IsbnPublishersPublicationsModal
            publisher={publisher}
            authenticationToken={authenticationToken}
            history={history}
          />
          {/* Modal for viewing publishers batches */}
          <PublishersBatchIdsModal
            publisher={publisher}
            authenticationToken={authenticationToken}
            history={history}
          />
          {/* Modal for viewing archive entry of publisher */}
          <IsbnPublisherArchiveEntryModal
            publisherId={publisher.id}
            authenticationToken={authenticationToken}
          />
        </div>
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'publisherRegistry.publisher.editPublisher'})}
          onClick={handleEditClick}
        >
          <EditIcon />
        </Fab>
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'publisherRegistry.publisher.downloadInformationPackage'})}
          onClick={handleDownloadPublisherInformationPackage}
        >
          <DownloadIcon />
        </Fab>
      </div>
      <div>{children}</div>
    </>
  );
}

IsbnPublisherDisplay.propTypes = {
  publisher: PropTypes.object.isRequired,
  handleEditClick: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default IsbnPublisherDisplay;
