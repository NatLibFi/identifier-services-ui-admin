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
import {Button, Modal, Box, Typography} from '@mui/material';

import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function IssnPublisherCreationModal(props) {
  const {formId, publisherName, userInfo, history, setSnackbarMessage, disabled} = props;
  const {authenticationToken} = userInfo;

  // State for the modal window (creating new ISSN-publisher)
  const [openCreatePublisherModal, setOpenCreatePublisherModal] = useState(false);

  // Event handlers for the modal window (creating new ISSN-publisher)
  const handleOpenCreatePublisherModal = () => setOpenCreatePublisherModal(true);
  const handleCloseCreatePublisherModal = () => {
    setOpenCreatePublisherModal(false);
  };

  // Handles approving a process of creating a new ISSN-publisher
  const handleApproveCreatingPublisher = async () => {
    const result = await makeApiRequest({
      url: `/api/issn-registry/requests/${formId}/add-publisher`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      redirect(history, `/issn-registry/publishers/${result.id}`);
    }
  };

  return (
    <>
      {/* Button that opens a modal for creating a new ISSN-publisher */}
      <Button
        disabled={disabled}
        className="requestButton"
        variant="outlined"
        color="primary"
        onClick={handleOpenCreatePublisherModal}
      >
        <FormattedMessage id="modal.issn.createPublisher" />
      </Button>
      <Modal
        open={openCreatePublisherModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseCreatePublisherModal}
      >
        <Box className="createListModal">
          <Typography variant="h6">
            <FormattedMessage id="modal.issn.createPublisher.new" />
          </Typography>
          <strong>{publisherName}</strong>
          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              onClick={handleApproveCreatingPublisher}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseCreatePublisherModal}
            >
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

IssnPublisherCreationModal.propTypes = {
  disabled: PropTypes.bool.isRequired,
  formId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  publisherName: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
};

export default IssnPublisherCreationModal;
