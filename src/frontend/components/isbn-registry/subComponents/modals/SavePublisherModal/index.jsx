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

import {FormattedMessage} from 'react-intl';
import {useAuth} from 'react-oidc-context';


import {
  Typography,
  Modal,
  Box,
  Switch
} from '@mui/material';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';

import Spinner from '/src/frontend/components/common/Spinner.jsx';

import PublicationRequestDetails from '/src/frontend/components/isbn-registry/subComponents/modals/SavePublisherModal/PublicationRequestDetails.jsx';
import PublisherDetails from '/src/frontend/components/isbn-registry/subComponents/modals/SavePublisherModal/PublisherDetails.jsx';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function SavePublisherModal(props) {
  const {
    publisherId,
    publicationRequest,
    setPublicationRequest,
    savePublisherModalOpen,
    setSavePublisherModalOpen,
    handleCloseSavePublisherModal
  } = props;
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  // State for the Switch element (publisher/request details)
  const [showPublicationRequestDetails, setShowPublicationRequestDetails] = useState(false);

  // Fetching data of the current request
  const {data, loading, error} = useItem({
    url: `/api/isbn-registry/publishers/${publisherId}`,
    method: 'GET',
    authenticationToken,
    dependencies: [savePublisherModalOpen],
    prefetch: false,
    fetchOnce: false,
    requireAuth: true,
    modalIsUsed: true,
    isModalOpen: savePublisherModalOpen
  });

  // Handles switching between publisher and request details
  const handleSwitchDetails = () => {
    setShowPublicationRequestDetails(!showPublicationRequestDetails);
  };

  return (
    <Modal open={savePublisherModalOpen} onClose={handleCloseSavePublisherModal}>
      <Box className="createListModal savePublisherModal">
        {/* Loading spinner */}
        {loading && <Spinner />}

        {/* Errors */}
        {error && <Typography>Could not fetch data due to API error</Typography>}

        {/* Content */}
        {!loading && !error && (
          <>
            <Typography variant="h4">
              <FormattedMessage id="modal.savePublisher" />
            </Typography>
            <div className="savePublisherModalSwitch">
              <Typography
                data-checked={!showPublicationRequestDetails}
                onClick={() => setShowPublicationRequestDetails(false)}
              >
                <FormattedMessage id="common.publisherDetails.isbn" />
              </Typography>
              <Switch
                label="switch between publisher and request details"
                checked={showPublicationRequestDetails}
                onChange={handleSwitchDetails}
                inputProps={{'aria-label': 'controlled switch'}}
              />
              <Typography
                data-checked={showPublicationRequestDetails}
                onClick={() => setShowPublicationRequestDetails(true)}
              >
                <FormattedMessage id="common.requestDetails" />
              </Typography>
            </div>

            {/* Show publication */}
            {showPublicationRequestDetails && <PublicationRequestDetails publicationRequest={publicationRequest} />}

            {/* Show publisher */}
            {!showPublicationRequestDetails &&
              <PublisherDetails
                publisher={data}
                publisherId={publisherId}
                publicationRequest={publicationRequest}
                setPublicationRequest={setPublicationRequest}
                setSnackbarMessage={setSnackbarMessage}
                authenticationToken={authenticationToken}
                setSavePublisherModalOpen={setSavePublisherModalOpen}
                handleCloseSavePublisherModal={handleCloseSavePublisherModal}
              />
            }
          </>
        )}
      </Box>
    </Modal>
  );
}

SavePublisherModal.propTypes = {
  setPublicationRequest: PropTypes.func.isRequired,
  savePublisherModalOpen: PropTypes.bool.isRequired,
  setSavePublisherModalOpen: PropTypes.func.isRequired,
  handleCloseSavePublisherModal: PropTypes.func.isRequired,
  publisherId: PropTypes.number,
  publicationRequest: PropTypes.object.isRequired
};

export default SavePublisherModal;
