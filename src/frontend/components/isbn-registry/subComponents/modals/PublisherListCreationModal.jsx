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

import {
  Button,
  Typography,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Input
} from '@mui/material';

import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';
import {MESSAGE_CODES} from '/src/frontend/components/common/form/constants';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

function PublisherListCreationModal(props) {
  const {publisherId, publisher, authenticationToken, setSnackbarMessage, history} = props;
  const intl = useIntl();

  const [identifierType, setIdentifierType] = useState(''); // State for selecting the type of an id to be granted
  const [openCreateListModal, setOpenCreateListModal] = useState(false); // State for the modal window (adding new ISBN/ISMN-list)
  const [amount, setAmount] = useState(0); // State for amount of identifiers to be added to the list
  const [loading, setLoading] = useState(false); // State for loading spinner

  // Event handlers for the modal window (adding new ISBN/ISMN-list)
  const handleOpenCreateListModal = () => setOpenCreateListModal(true);
  const handleCloseCreateListModal = () => {
    setOpenCreateListModal(false);
    setIdentifierType('');
    setAmount(0);
  };

  // Handles changing of the amount of ISBN/ISMN-identifiers to be created
  const handleChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  // Handles changes to the type of an id to be granted
  const handleChangeIdentifierType = (event) => {
    setIdentifierType(event.target.value);
  };

  // Handles approving of a list creating process
  const handleApproveAddingAList = async () => {
    setLoading(true);
    const redirectRoute = '/isbn-registry/messages/form/send';
    const redirectMessageCode =
      identifierType === 'isbn'
        ? MESSAGE_CODES.SEND_LIST_ISBN
        : MESSAGE_CODES.SEND_LIST_ISMN;
    const values = {publisherId, count: parseInt(amount, 10)};

    const result = await makeApiRequest({
      url: `/api/isbn-registry/identifierbatches/${identifierType}`,
      method: 'POST',
      values,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      const redirectState = {
        messageCode: redirectMessageCode,
        publisherId,
        identifierBatchId: result.id
      };
      redirect(history, redirectRoute, redirectState);
    }

    setOpenCreateListModal(false);
    setIdentifierType('');
    setAmount(0);
  };

  function canAttemptCreateIdentifierList() {
    if (identifierType === 'isbn') {
      const activeSubranges = publisher.isbnSubRanges.filter(
        (subrange) => subrange.isActive
      );
      return activeSubranges.length > 0;
    }

    const activeSubranges = publisher.ismnSubRanges.filter(
      (subrange) => subrange.isActive
    );
    return activeSubranges.length > 0;
  }

  return (
    <>
      {/* Button that opens a modal for creating a new ISBN/ISMN-list */}
      <Button
        className="buttons"
        variant="outlined"
        color="primary"
        onClick={handleOpenCreateListModal}
      >
        <FormattedMessage id="modal.batch.create" />
      </Button>
      <Modal
        open={openCreateListModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseCreateListModal}
      >
        <Box className="createListModal">
          <Typography variant="h6">
            <FormattedMessage id="modal.batch.create" />
          </Typography>
          {/* Input for choosing a type of identifier list (ISBN/ISMN) */}
          <FormControl className="createListInnerContainer">
            <InputLabel>{intl.formatMessage({id: 'common.identifiers'})}</InputLabel>
            <Select
              value={identifierType}
              label={intl.formatMessage({id: 'common.identifiers'})}
              onChange={handleChangeIdentifierType}
            >
              <MenuItem value="isbn">ISBN</MenuItem>
              <MenuItem value="ismn">ISMN</MenuItem>
            </Select>
          </FormControl>
          {/* Input for choosing an amount of identifiers to be created */}
          <Input
            className="amountOfIdentifiersInput"
            type="number"
            placeholder={intl.formatMessage({id: 'common.amount'})}
            inputProps={{min: 1}}
            onChange={handleChangeAmount}
          />
          {/* Show loading spinner while creating a new ISBN/ISMN-list */}
          {loading && <Spinner />}
          <div className="createListInnerContainer">
            <Button
              disabled={identifierType === '' || !canAttemptCreateIdentifierList()}
              variant="contained"
              color="success"
              onClick={handleApproveAddingAList}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseCreateListModal}
            >
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

PublisherListCreationModal.propTypes = {
  publisherId: PropTypes.string.isRequired,
  publisher: PropTypes.object.isRequired,
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default PublisherListCreationModal;
