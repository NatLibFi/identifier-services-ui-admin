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

import {
  Button,
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';
import {langCodeOptions} from '/src/frontend/components/common/form/constants';

function IssnPublisherQuickFormModal({createIssnPublisher}) {
  // State for the modal window
  const [openCreatePublisherModal, setOpenCreatePublisherModal] = useState(false);

  // State for the form fields
  const [officialName, setOfficialName] = useState('');
  const [address, setAddress] = useState('');
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  const [langCode, setLangCode] = useState('');

  // Event handlers for the modal window
  const handleOpenCreatePublisherModal = () => setOpenCreatePublisherModal(true);
  const handleCloseCreatePublisherModal = () => setOpenCreatePublisherModal(false);

  // Handles approving a process of creating a new ISSN-publisher
  const handleApproveCreatingPublisher = async () => {
    const values = {
      officialName,
      address,
      zip,
      city,
      langCode
    };

    const result = await createIssnPublisher(values);

    if (result) {
      setOpenCreatePublisherModal(false);
    }
  };

  // Handlers for the form fields
  const handleChangeOfficialName = (event) => setOfficialName(event.target.value);
  const handleChangeAddress = (event) => setAddress(event.target.value);
  const handleChangeZip = (event) => setZip(event.target.value);
  const handleChangeCity = (event) => setCity(event.target.value);
  const handleChangeLangCode = (event) => setLangCode(event.target.value);

  return (
    <>
      {/* Button that opens a modal for creating a new ISSN-publisher */}
      <Button
        className="buttons"
        variant="contained"
        color="success"
        onClick={handleOpenCreatePublisherModal}
        startIcon={<AddIcon />}
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

          {/* Publisher's official name field */}
          <FormControl className="createListInnerContainer">
            <InputLabel>
              <FormattedMessage id="modal.issn.createPublisher.quick.name" />
            </InputLabel>
            <OutlinedInput
              value={officialName || ''}
              onChange={handleChangeOfficialName}
              label={<FormattedMessage id="modal.issn.createPublisher.quick.name" />}
            />
          </FormControl>

          {/* Address field */}
          <FormControl className="createListInnerContainer">
            <InputLabel>
              <FormattedMessage id="form.common.address" />
            </InputLabel>
            <OutlinedInput
              value={address || ''}
              onChange={handleChangeAddress}
              label={<FormattedMessage id="form.common.address" />}
            />
          </FormControl>

          {/* Zip code field */}
          <FormControl className="createListInnerContainer">
            <InputLabel>
              <FormattedMessage id="form.common.zip" />
            </InputLabel>
            <OutlinedInput
              value={zip || ''}
              onChange={handleChangeZip}
              label={<FormattedMessage id="form.common.zip" />}
            />
          </FormControl>

          {/* City field */}
          <FormControl className="createListInnerContainer">
            <InputLabel>
              <FormattedMessage id="form.common.city" />
            </InputLabel>
            <OutlinedInput
              value={city || ''}
              onChange={handleChangeCity}
              label={<FormattedMessage id="form.common.city" />}
            />
          </FormControl>

          {/* Publisher's preferred language field */}
          <FormControl className="createListInnerContainer">
            <InputLabel>
              <FormattedMessage id="form.common.language" />
            </InputLabel>
            <Select
              label={<FormattedMessage id="form.common.language" />}
              value={langCode || ''}
              onChange={handleChangeLangCode}
            >
              {langCodeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <FormattedMessage id={option.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="createListInnerContainer">
            <Button
              disabled={!officialName || !address || !zip || !city || !langCode}
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

IssnPublisherQuickFormModal.propTypes = {
  createIssnPublisher: PropTypes.func.isRequired
};

export default IssnPublisherQuickFormModal;
