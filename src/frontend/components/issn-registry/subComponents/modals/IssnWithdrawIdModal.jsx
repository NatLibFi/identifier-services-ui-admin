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
import {FormattedMessage} from 'react-intl';
import PropTyps from 'prop-types';
import {Button, Modal, Box, Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function IssnWithdrawIdModal({withdrawIssnPublicationId, id, token, history}) {
  // State for the modal window (withdraw existing ISSN id)
  const [openWithdrawIssnIdModal, setOpenWithdrawIssnIdModal] = useState(false);

  // Event handlers for the modal window (withdraw existing ISSN id)
  const handleOpenWithdrawIssnIdModal = () => setOpenWithdrawIssnIdModal(true);
  const handleCloseWithdrawIssnIdModal = () => setOpenWithdrawIssnIdModal(false);

  // Handles approving a process of withdrawing an existing ISSN id
  const handleApproveWithdrawIssnId = async () => {
    setOpenWithdrawIssnIdModal(false);
    withdrawIssnPublicationId(id, token, history);
  };

  return (
    <>
      {/* Button that opens a modal for withdrawing an existing ISSN id */}
      <Button
        className="requestButton"
        variant="contained"
        color="primary"
        onClick={handleOpenWithdrawIssnIdModal}
      >
        <FormattedMessage id="modal.issn.withdrawId" />
      </Button>
      <Modal
        open={openWithdrawIssnIdModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseWithdrawIssnIdModal}
      >
        <Box className="createListModal">
          <Typography variant="h6">
            <FormattedMessage id="modal.issn.withdrawId.approve" />
          </Typography>
          {id}
          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              onClick={handleApproveWithdrawIssnId}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseWithdrawIssnIdModal}
            >
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

IssnWithdrawIdModal.propTypes = {
  withdrawIssnPublicationId: PropTyps.func.isRequired,
  token: PropTyps.string.isRequired,
  history: PropTyps.object.isRequired,
  id: PropTyps.string.isRequired
};

export default IssnWithdrawIdModal;
