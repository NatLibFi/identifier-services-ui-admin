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
import {FormattedMessage, useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {
  Button,
  Typography,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Input
} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function ResendMessageModal({resendEmailMessage}) {
  const intl = useIntl();

  // State for the modal window (open/close)
  const [openResendMessageModal, setOpenResendMessageModal] = useState(false);
  // State for sending message to a new recipient
  const [recipient, setRecipient] = useState('');

  // Event handlers for the modal window (open/close)
  const handleOpenResendMessageModal = () => setOpenResendMessageModal(true);
  const handleCloseResendMessageModal = () => setOpenResendMessageModal(false);

  // Handles changes to the recipient's email address
  const handleChangeRecipient = (event) => {
    setRecipient(event.target.value);
  };

  // Handles approving resending message
  const handleApproveResending = async () => {
    if (recipient) {
      resendEmailMessage(recipient);
    }

    setOpenResendMessageModal(false);
    setRecipient('');
  };

  return (
    <>
      {/* Button that oppens a modal window */}
      <Button
        className="buttons"
        variant="outlined"
        color="primary"
        onClick={handleOpenResendMessageModal}
      >
        <FormattedMessage id="messages.sendMessageAgain" />
      </Button>
      {/* Modal window for resending a message */}
      <Modal open={openResendMessageModal} onClose={handleCloseResendMessageModal}>
        <Box className="createListModal">
          <Typography variant="h6">
            <FormattedMessage id="modal.resendMessage.addRecipient" />
          </Typography>
          {/* Input field for passing a recipient's email address */}
          <FormControl className="createListInnerContainer">
            <InputLabel>{intl.formatMessage({id: 'form.common.email'})}</InputLabel>
            <Input
              label="form.common.email"
              value={recipient}
              onChange={handleChangeRecipient}
            />
          </FormControl>
          {/* Buttons for approving/rejecting the process of resending a message */}
          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              disabled={!recipient}
              onClick={handleApproveResending}
            >
              <FormattedMessage id="form.button.label.submit" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseResendMessageModal}
            >
              <FormattedMessage id="form.button.label.cancel" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

ResendMessageModal.propTypes = {
  resendEmailMessage: PropTypes.func.isRequired
};

export default ResendMessageModal;
