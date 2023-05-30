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
import PropTypes from 'prop-types';
import {Button, Modal, Box, Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function IssnGrantIdModal(props) {
  const {grantIssnPublicationId, id, token, history, publisherId} = props;
  // State for the modal window (adding new ISSN id)
  const [openGrantIssnIdModal, setOpenGrantIssnIdModal] = useState(false);

  // Event handlers for the modal window (adding new ISSN id)
  const handleOpenGrantIssnIdModal = () => setOpenGrantIssnIdModal(true);
  const handleCloseGrantIssnIdModal = () => setOpenGrantIssnIdModal(false);

  // Handles approving a process of adding a new ISSN id
  const handleApproveGrantingIssnId = async () => {
    setOpenGrantIssnIdModal(false);
    grantIssnPublicationId(id, token, history);
  };

  return (
    <>
      {/* Button that opens a modal for adding a new ISSN id */}
      <Button
        disabled={!publisherId}
        className="requestButton"
        variant="contained"
        color="primary"
        onClick={handleOpenGrantIssnIdModal}
      >
        <FormattedMessage id="modal.issn.grandId" />
      </Button>
      <Modal
        open={openGrantIssnIdModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseGrantIssnIdModal}
      >
        <Box className="createListModal">
          <Typography variant="h6">
            <FormattedMessage id="form.button.label.grant" values={{type: 'ISSN'}} />
          </Typography>
          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              onClick={handleApproveGrantingIssnId}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseGrantIssnIdModal}
            >
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

IssnGrantIdModal.propTypes = {
  grantIssnPublicationId: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  publisherId: PropTypes.string
};

export default IssnGrantIdModal;
