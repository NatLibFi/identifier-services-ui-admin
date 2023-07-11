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

import React, {useState, useReducer} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';

import {
  Button,
  Modal,
  Box,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import {
  publicationFormatOptions,
  printFormats,
  electronicFormats
} from '/src/frontend/components/common/form/constants';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function PublicationRequestCreationModal(props) {
  const {authenticationToken, setSnackbarMessage, history} = props;

  // State for the modal window
  const [openModal, setOpenModal] = useState(false);

  // Initial state of the form fields
  const initialState = {
    publisherName: '',
    publicationName: '',
    publicationSubTitle: '',
    authorName: '',
    contactEmail: '',
    publicationType: '',
    publicationAddress: '',
    placeOfPublication: '',
    publicationMonth: '',
    publicationYear: '',
    fileFormat: '',
    printFormat: ''
  };

  // State handler for the form fields
  const [form, updateForm] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialState);

  // Event handlers for the modal window (open/close)
  const handleOpenModal = () => setOpenModal(true);

  // Handles closing the modal window and resetting the form fields
  const handleCloseModal = () => {
    setOpenModal(false);

    // Reset the form fields on close
    updateForm(initialState);
  };

  // Handles approving a process of adding a new ISBN/ISMN publication request
  const handleApproveAddingRequest = async () => {
    setOpenModal(false);

    const formattedValues = {
      // Format the values to match the API requirements
      officialName: form.publisherName,
      title: form.publicationName,
      subtitle: form.publicationSubTitle || '',
      firstName1: form.authorName.split(' ').shift(),
      lastName1: form.authorName.split(' ').pop(),
      email: form.contactEmail || '',
      publicationFormat: form.publicationType,
      type: [form.printFormat],
      address: form.publicationAddress || '',
      fileformat: [form.fileFormat],
      city: form.placeOfPublication,
      year: form.publicationYear.toString(),
      month: moment().month(form.publicationMonth).format('MM'),
      // Set other required fields to placeholder values
      role1: ['AUTHOR'],
      zip: '00000',
      contactPerson: 'Ei ole',
      phone: '04012345678',
      langCode: 'fi-FI',
      publicationsPublic: true,
      publicationType: 'BOOK',
      publishingActivity: 'CONTINUOUS',
      language: 'FIN'
    };

    // If type is PRINT, remove file format values
    if (formattedValues.publicationFormat === 'PRINT') {
      delete formattedValues.fileformat;
    }
    // If type is ELECTRONIC, remove print format values
    if (formattedValues.publicationFormat === 'ELECTRONICAL') {
      delete formattedValues.type;
    }

    const result = await makeApiRequest({
      url: '/api/isbn-registry/requests/publications',
      method: 'POST',
      values: formattedValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      redirect(history, `/isbn-registry/requests/publications/${result.id}`);
    }
  };

  // Get the months as options
  const months = moment.monthsShort();

  // Get the current year and set it and the next 5 years as options
  const currentYear = moment().year();
  const years = [
    currentYear,
    currentYear + 1,
    currentYear + 2,
    currentYear + 3,
    currentYear + 4,
    currentYear + 5
  ];

  const submitButtonIsDisabled = () => {
    const buttonIsDisabled =
      !form.publisherName ||
      !form.publicationName ||
      !form.authorName ||
      !form.publicationType ||
      !form.placeOfPublication ||
      !form.publicationMonth ||
      !form.publicationYear;

    if (form.publicationType === 'PRINT') {
      return !form.printFormat || buttonIsDisabled;
    }
    if (form.publicationType === 'ELECTRONICAL') {
      return !form.fileFormat || buttonIsDisabled;
    }
    if (form.publicationType === 'PRINT_ELECTRONICAL') {
      return !form.printFormat || !form.fileFormat || buttonIsDisabled;
    }

    return buttonIsDisabled;
  };

  return (
    <>
      {/* Button that opens a modal for adding a new ISSN-publication */}
      <Button
        className="buttons"
        variant="contained"
        color="success"
        onClick={handleOpenModal}
        startIcon={<AddIcon />}
      >
        <FormattedMessage id="modal.publicationrequest.create" />
      </Button>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className="createListModal publicationRequestModal">
          <div className="issnPublicationModalContainer">
            <Typography variant="h5">
              <FormattedMessage id="modal.publicationrequest.create" />
            </Typography>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="common.name" />
              </InputLabel>
              <OutlinedInput
                value={form.publisherName || ''}
                onChange={(event) => updateForm({publisherName: event.target.value})}
                label={<FormattedMessage id="common.name" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.title" />
              </InputLabel>
              <OutlinedInput
                value={form.publicationName || ''}
                onChange={(event) => updateForm({publicationName: event.target.value})}
                label={<FormattedMessage id="form.common.title" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.subtitle" />
              </InputLabel>
              <OutlinedInput
                value={form.publicationSubTitle || ''}
                onChange={(event) =>
                  updateForm({publicationSubTitle: event.target.value})
                }
                label={<FormattedMessage id="form.common.subtitle" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.authorName" />
              </InputLabel>
              <OutlinedInput
                value={form.authorName || ''}
                onChange={(event) => updateForm({authorName: event.target.value})}
                label={<FormattedMessage id="form.common.authorName" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.email" />
              </InputLabel>
              <OutlinedInput
                value={form.contactEmail || ''}
                onChange={(event) => updateForm({contactEmail: event.target.value})}
                label={<FormattedMessage id="form.common.email" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.address" />
              </InputLabel>
              <OutlinedInput
                value={form.publicationAddress || ''}
                onChange={(event) => updateForm({publicationAddress: event.target.value})}
                label={<FormattedMessage id="form.common.address" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.city" />
              </InputLabel>
              <OutlinedInput
                value={form.placeOfPublication || ''}
                onChange={(event) => updateForm({placeOfPublication: event.target.value})}
                label={<FormattedMessage id="form.common.city" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.selectFormat" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.selectFormat" />}
                value={form.publicationType || ''}
                onChange={(event) => updateForm({publicationType: event.target.value})}
              >
                {publicationFormatOptions.map((format) => (
                  <MenuItem key={format.value} value={format.value}>
                    {format.label === '' ? '' : <FormattedMessage id={format.label} />}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(form.publicationType === 'PRINT' ||
              form.publicationType === 'PRINT_ELECTRONICAL') && (
              <FormControl className="createListInnerContainer">
                <InputLabel>
                  <FormattedMessage id="form.common.printFormat" />
                </InputLabel>
                <Select
                  label={<FormattedMessage id="form.common.printFormat" />}
                  value={form.printFormat || ''}
                  onChange={(event) => updateForm({printFormat: event.target.value})}
                >
                  {printFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label === '' ? '' : <FormattedMessage id={format.label} />}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {(form.publicationType === 'ELECTRONICAL' ||
              form.publicationType === 'PRINT_ELECTRONICAL') && (
              <FormControl className="createListInnerContainer">
                <InputLabel>
                  <FormattedMessage id="form.common.fileFormat" />
                </InputLabel>
                <Select
                  label={<FormattedMessage id="form.common.fileFormat" />}
                  value={form.fileFormat || ''}
                  onChange={(event) => updateForm({fileFormat: event.target.value})}
                >
                  {electronicFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label === '' ? '' : <FormattedMessage id={format.label} />}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.publicationMonth" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.publicationMonth" />}
                value={form.publicationMonth || ''}
                onChange={(event) => updateForm({publicationMonth: event.target.value})}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {moment().month(month).format('MMMM').charAt(0).toUpperCase() +
                      moment().month(month).format('MMMM').slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.publicationYear" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.publicationYear" />}
                value={form.publicationYear || ''}
                onChange={(event) => updateForm({publicationYear: event.target.value})}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              disabled={submitButtonIsDisabled()}
              onClick={handleApproveAddingRequest}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModal}>
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

PublicationRequestCreationModal.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default PublicationRequestCreationModal;
