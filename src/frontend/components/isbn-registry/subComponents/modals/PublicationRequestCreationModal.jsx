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
import {FormattedMessage, useIntl} from 'react-intl';
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
  Typography,
  FormHelperText
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

  const intl = useIntl();

  // State for the modal window
  const [openModal, setOpenModal] = useState(false);

  // Form fields that have been touched
  const [touchedFields, setTouchedFields] = useState([]);

  // Initial state of the form fields
  const initialState = {
    publisherName: '',
    publicationName: '',
    publicationSubtitle: '',
    authorName: '',
    contactEmail: '',
    publicationType: '',
    publicationAddress: '',
    zip: '',
    city: '',
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
    const formattedValues = {
      // Format the values to match the API requirements
      officialName: form.publisherName,
      title: form.publicationName,
      subtitle: form.publicationSubtitle || '',
      firstName1: form.authorName.split(' ').shift(),
      lastName1: form.authorName.split(' ').pop(),
      email: form.contactEmail || '',
      publicationFormat: form.publicationType,
      type: form.printFormat,
      address: form.publicationAddress || '',
      zip: form.zip || '',
      city: form.city || '',
      fileformat: form.fileFormat,
      year: form.publicationYear.toString(),
      month: moment().month(form.publicationMonth).format('MM'),
      // Set other required fields to placeholder values, since some sort of value is required by the API (can not be completely empty)
      role1: ['AUTHOR'],
      contactPerson: '',
      phone: '',
      langCode: 'fi-FI',
      publicationsPublic: true,
      publicationType: 'BOOK',
      publishingActivity: 'OCCASIONAL',
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

    // If the request was successful, close the modal and redirect to the request page
    if (result) {
      setOpenModal(false);
      redirect(history, `/isbn-registry/requests/publications/${result.id}`);
    }
  };

  // Get the months as options
  const months = moment.monthsShort();

  // Get the current year and set it and the next 5 years as options
  const currentYear = moment().year();
  const years = Array.from({length: 6}, (_, i) => currentYear + i);

  const submitButtonIsDisabled = () => {
    const buttonIsDisabled =
      !form.publisherName ||
      !form.publicationName ||
      !form.authorName ||
      !form.publicationType ||
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

  // Check if a field is invalid
  const fieldIsInvalid = (field) => {
    return touchedFields.includes(field) && !form[field];
  };

  function getCommonFormField(intlInputId, formAttributeName, required=false) {
    return (
      <FormControl className="createListInnerContainer" required={required}>
        <InputLabel>
          <FormattedMessage id={intlInputId} />
        </InputLabel>
        <OutlinedInput
          value={form[formAttributeName] || ''}
          onChange={(event) => updateForm({[formAttributeName]: event.target.value})}
          onBlur={() => setTouchedFields([...touchedFields, formAttributeName])}
          label={<FormattedMessage id={intlInputId} />}
          inputProps={{'aria-invalid': required && fieldIsInvalid(formAttributeName)}}
        />
        {fieldIsInvalid(formAttributeName) && required && (
          <FormHelperText error>
            <FormattedMessage id="error.field.required" />
          </FormHelperText>
        )}
      </FormControl>
    );
  }

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

            {getCommonFormField('form.common.name', 'publisherName', true)}
            {getCommonFormField('form.common.title', 'publicationName', true)}
            {getCommonFormField('form.common.subtitle', 'publicationSubtitle', false)}
            {getCommonFormField('form.common.authorName', 'authorName', true)}
            {getCommonFormField('form.common.email', 'contactEmail', false)}
            {getCommonFormField('form.common.address', 'publicationAddress', false)}
            {getCommonFormField('form.common.zip', 'zip', false)}
            {getCommonFormField('form.common.city', 'city', false)}

            <FormControl className="createListInnerContainer" required>
              <InputLabel>
                <FormattedMessage id="form.common.selectFormat" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.selectFormat" />}
                value={form.publicationType || ''}
                onChange={(event) => updateForm({publicationType: event.target.value})}
                onBlur={() => setTouchedFields([...touchedFields, 'publicationType'])}
                aria-invalid={fieldIsInvalid('publicationType')}
              >
                {publicationFormatOptions.map((format) => (
                  <MenuItem key={format.value} value={format.value}>
                    {format.label === '' ? '' : <FormattedMessage id={format.label} />}
                  </MenuItem>
                ))}
              </Select>
              {fieldIsInvalid('publicationType') && (
                <FormHelperText error>
                  <FormattedMessage id="error.field.required" />
                </FormHelperText>
              )}
            </FormControl>

            {(form.publicationType === 'PRINT' ||
              form.publicationType === 'PRINT_ELECTRONICAL') && (
              <FormControl className="createListInnerContainer" required>
                <InputLabel>
                  <FormattedMessage id="form.common.printFormat" />
                </InputLabel>
                <Select
                  multiple
                  label={<FormattedMessage id="form.common.printFormat" />}
                  value={form.printFormat || []}
                  onChange={(event) => updateForm({printFormat: event.target.value})}
                  onBlur={() => setTouchedFields([...touchedFields, 'printFormat'])}
                  aria-invalid={fieldIsInvalid('printFormat')}
                >
                  {printFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label === '' ? '' : <FormattedMessage id={format.label} />}
                    </MenuItem>
                  ))}
                </Select>
                {fieldIsInvalid('printFormat') && (
                  <FormHelperText error>
                    <FormattedMessage id="error.field.required" />
                  </FormHelperText>
                )}
              </FormControl>
            )}

            {(form.publicationType === 'ELECTRONICAL' ||
              form.publicationType === 'PRINT_ELECTRONICAL') && (
              <FormControl className="createListInnerContainer" required>
                <InputLabel>
                  <FormattedMessage id="form.common.fileFormat" />
                </InputLabel>
                <Select
                  multiple
                  label={<FormattedMessage id="form.common.fileFormat" />}
                  value={form.fileFormat || []}
                  onChange={(event) => updateForm({fileFormat: event.target.value})}
                  onBlur={() => setTouchedFields([...touchedFields, 'fileFormat'])}
                  aria-invalid={fieldIsInvalid('fileFormat')}
                >
                  {electronicFormats.map((format) => (
                    <MenuItem key={format.value} value={format.value}>
                      {format.label === '' ? '' : <FormattedMessage id={format.label} />}
                    </MenuItem>
                  ))}
                </Select>
                {fieldIsInvalid('fileFormat') && (
                  <FormHelperText error>
                    <FormattedMessage id="error.field.required" />
                  </FormHelperText>
                )}
              </FormControl>
            )}

            <FormControl className="createListInnerContainer" required>
              <InputLabel>
                <FormattedMessage id="form.common.publicationMonth" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.publicationMonth" />}
                value={form.publicationMonth || ''}
                onChange={(event) => updateForm({publicationMonth: event.target.value})}
                onBlur={() => setTouchedFields([...touchedFields, 'publicationMonth'])}
                aria-invalid={fieldIsInvalid('publicationMonth')}
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {moment().month(month).format('MMMM').charAt(0).toUpperCase() +
                      moment().month(month).format('MMMM').slice(1)}
                  </MenuItem>
                ))}
              </Select>
              {fieldIsInvalid('publicationMonth') && (
                <FormHelperText error>
                  <FormattedMessage id="error.field.required" />
                </FormHelperText>
              )}
            </FormControl>

            <FormControl className="createListInnerContainer" required>
              <InputLabel>
                <FormattedMessage id="form.common.publicationYear" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.publicationYear" />}
                value={form.publicationYear || ''}
                onChange={(event) => updateForm({publicationYear: event.target.value})}
                onBlur={() => setTouchedFields([...touchedFields, 'publicationYear'])}
                aria-invalid={fieldIsInvalid('publicationYear')}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {fieldIsInvalid('publicationYear') && (
                <FormHelperText error>
                  <FormattedMessage id="error.field.required" />
                </FormHelperText>
              )}
            </FormControl>
          </div>

          {/* Display placeholder data that comes by default in quick form */}
          <section className="placeholderDataFields">
            <h6>
              <FormattedMessage id="modal.publicationRequest.placeholderFields" />
            </h6>
            <p>
              <FormattedMessage id="modal.publicationRequest.placeholderFields.description" />
            </p>

            <div>
              <span>
                <strong><FormattedMessage id="modal.publicationRequest.placeholderFields.authorsRole" />:</strong>
                {intl.formatMessage({id: 'form.isbnIsmn.authors.role.option.author'}).toLowerCase()}
              </span>
              <span>
                <strong><FormattedMessage id="request.publication.contactLanguage" />:</strong>
                {intl.formatMessage({id: 'common.fi-FI'})}
              </span>
              <span>
                <strong><FormattedMessage id="form.isbnIsmn.preview.isPublic" />:</strong>
                {intl.formatMessage({id: 'common.yes'}).toLowerCase()}
              </span>
              <span>
                <strong><FormattedMessage id="form.issn.publicationCard.publicationType" />:</strong>
                {intl.formatMessage({id: 'common.BOOK'}).toLowerCase()}
              </span>
              <span>
                <strong><FormattedMessage id="form.common.publishingActivities" />:</strong>
                {intl.formatMessage({id: 'form.isbnIsmn.publishingActivities.option.occasional'}).toLowerCase()}
              </span>
              <span>
                <strong><FormattedMessage id="request.publication.publicationLanguage" />:</strong>
                {intl.formatMessage({id: 'common.fin'})}
              </span>
            </div>
          </section>

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
