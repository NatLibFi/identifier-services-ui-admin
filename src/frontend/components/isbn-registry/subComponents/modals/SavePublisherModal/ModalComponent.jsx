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

import {
  Typography,
  Modal,
  Box,
  Switch
} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

import PublicationRequestDetails from '/src/frontend/components/isbn-registry/subComponents/modals/SavePublisherModal/PublicationRequestDetails.jsx';
import PublisherDetails from '/src/frontend/components/isbn-registry/subComponents/modals/SavePublisherModal/PublisherDetails.jsx';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function ModalComponent(props) {
  const {
    publisherId,
    publicationRequest,
    setPublicationRequest,
    authenticationToken,
    savePublisherModalOpen,
    setSavePublisherModalOpen,
    setSnackbarMessage,
    handleCloseSavePublisherModal
  } = props;

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

  // Component to be displayed
  const component = getComponent();

  // Get the component to be displayed for different cases
  function getComponent() {
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

    // Display a message if object is empty, or data is not a type of object
    if (typeof data !== 'object' || Object.keys(data).length === 0) {
      return (
        <div>
          <Typography>
            <FormattedMessage id="modal.savePublisher.noData" />
          </Typography>
        </div>
      );
    }

    // Display publication request details if the switch is on
    if (showPublicationRequestDetails) {
      return (
        <PublicationRequestDetails publicationRequest={publicationRequest} />
      );
    }

    // Display publisher details if the switch is off (default)
    return (
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
    );
  }

  return (
    <Modal open={savePublisherModalOpen} onClose={handleCloseSavePublisherModal}>
      <Box className="createListModal savePublisherModal">
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
        {component}
      </Box>
    </Modal>
  );
}

ModalComponent.propTypes = {
  setPublicationRequest: PropTypes.func.isRequired,
  savePublisherModalOpen: PropTypes.bool.isRequired,
  setSavePublisherModalOpen: PropTypes.func.isRequired,
  handleCloseSavePublisherModal: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  publisherId: PropTypes.number,
  publicationRequest: PropTypes.object.isRequired,
  authenticationToken: PropTypes.string.isRequired
};

export default ModalComponent;
