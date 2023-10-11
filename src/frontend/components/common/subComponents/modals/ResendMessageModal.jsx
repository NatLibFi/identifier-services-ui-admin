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
import moment from 'moment';

import {
  Button,
  Typography,
  Modal,
  Box,
  Link,
  TextField
} from '@mui/material';
import {Link as LinkIcon} from '@mui/icons-material';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function ResendMessageModal(props) {
  const {message, resendEmailMessage, editorRef} = props;
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
        <Box className="createListModal resendMessageModal">
          <Typography variant="h4">
            <FormattedMessage id="modal.resendMessage.title" />
          </Typography>

          <Typography variant="h5">
            <FormattedMessage id="form.common.provideNewEmail" />
          </Typography>
          {/* Input field for passing a new email address */}
          <TextField
            variant="outlined"
            label={intl.formatMessage({id: 'form.common.newEmail'})}
            value={recipient}
            onChange={handleChangeRecipient}
          />

          <Typography variant="h5">
            <FormattedMessage id="form.common.originalEmailInfo" />
          </Typography>
          {/* Information about the original message */}
          <div className="messageBoxContainer">
            <p>
              <span><FormattedMessage id="form.common.email" />:</span>
              <span>{message.recipient}</span>
            </p>

            <p>
              <span><FormattedMessage id="common.publisher.isbn" />:</span>
              <span>{message.publisherId && message.publisherId !== 0 ? (
                <Link
                  className="messageLink"
                  href={`/isbn-registry/publishers/${message.publisherId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FormattedMessage id="common.publisherDetails.isbn" /> <LinkIcon />
                </Link>
              ) : (
                <FormattedMessage id="common.noValue" />
              )}
              </span>
            </p>

            {message.batchId && message.batchId !== 0 && !message.publicationId && (
              <p>
                <span><FormattedMessage id="common.batch" />:</span>
                <span>
                  <Link
                    className="messageLink"
                    href={`/isbn-registry/identifierbatches/${message.batchId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FormattedMessage id="common.batchDetails" /> <LinkIcon />
                  </Link>
                </span>
              </p>
            )}

            <p>
              <span><FormattedMessage id="common.publication" />:</span>
              <span>
                {message.publicationId && message.publicationId !== 0 ? (
                  <Link
                    className="messageLink"
                    href={`/isbn-registry/requests/publications/${message.publicationId}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FormattedMessage id="common.publicationDetails" /> <LinkIcon />
                  </Link>
                ) : (
                  <FormattedMessage id="common.noValue" />
                )}
              </span>
            </p>

            <p>
              <span><FormattedMessage id="messages.sent" />:</span>
              <span>{moment(message.sent).format('LLL')} ({message.sentBy})</span>
            </p>

            <p>
              <span><FormattedMessage id="messages.subject" />:</span>
              <span>{message.subject}</span>
            </p>

            <div className="messageTextContainer">
              <BundledEditor
                onInit={(_evt, editor) => (editorRef.current = editor)}
                initialValue={message.message}
              />
            </div>
          </div>

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
  resendEmailMessage: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  editorRef: PropTypes.object.isRequired
};

export default ResendMessageModal;
