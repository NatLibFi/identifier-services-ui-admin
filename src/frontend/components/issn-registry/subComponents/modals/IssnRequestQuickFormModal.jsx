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
  OutlinedInput,
  MobileStepper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';
import {langCodeOptions, publishingLanguages, mediumOptions} from '/src/frontend/components/common/form/constants';

function IssnRequestQuickFormModal({createIssnRequest}) {
  // State for the stepper
  const [activeStep, setActiveStep] = useState(0);

  // State for the modal window
  const [openModal, setOpenModal] = useState(false);

  // State for disabling the submit button while the request is being processed
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  // Initial state of the form fields
  const initialState = {
    publisher: '',
    contactPerson: '',
    email: '',
    address: '',
    zip: '',
    city: '',
    langCode: '',
    title: '',
    placeOfPublication: '',
    language: '',
    medium: ''
  };

  // State handler for the form fields
  const [form, updateForm] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialState);

  // Event handlers for the stepper
  const handleNext = () => setActiveStep((prevActiveStep) => ++prevActiveStep);
  const handleBack = () => setActiveStep((prevActiveStep) => --prevActiveStep);

  // Event handlers for the modal window
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setActiveStep(0);
    updateForm(initialState);
  };

  // Handles approving a process of creating a new ISSN-publisher
  async function handleApproveCreatingRequest() {
    const values = {
      form: {
        publisher: form.publisher,
        contactPerson: form.contactPerson,
        email: form.email,
        address: form.address,
        zip: form.zip,
        city: form.city,
        langCode: form.langCode
      },
      publications: [
        {
          title: form.title,
          placeOfPublication: form.placeOfPublication ? form.placeOfPublication : undefined,
          language: form.language,
          medium: form.medium
        }
      ]
    };

    setButtonsDisabled(true);
    const result = await createIssnRequest(values);

    if (result) {
      handleCloseModal();
    }

    setButtonsDisabled(false);
  }

  // Checks if the submit button should be disabled
  // IF any of the fields are empty OR the button is already pressed and the request is being processed
  const submitButtonIsDisabled = () => {
    return (
      !form.publisher ||
      !form.langCode ||
      !form.title ||
      !form.language ||
      !form.medium ||
      buttonsDisabled
    );
  };

  const publisherTextFields = [
    {label: 'modal.issn.createPublisher.quick.name', value: 'publisher'},
    {label: 'form.common.contactPerson', value: 'contactPerson'},
    {label: 'form.common.email', value: 'email'},
    {label: 'form.common.address', value: 'address'},
    {label: 'form.common.zip', value: 'zip'},
    {label: 'form.common.city', value: 'city'}
  ];

  const publicationTextFields = [
    {label: 'form.common.title', value: 'title'},
    {label: 'form.common.publicationCity', value: 'placeOfPublication'}
  ];

  return (
    <>
      {/* Button that opens a modal for adding a new ISSN request */}
      <Button
        className="buttons"
        variant="contained"
        color="success"
        onClick={handleOpenModal}
        startIcon={<AddIcon />}
      >
        <FormattedMessage id="modal.issn.addRequest" />
      </Button>
      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseModal}
      >
        <Box className="createListModal issnRequestModal">
          <Typography variant="h5">
            <FormattedMessage id="modal.issn.addRequest.new" />
          </Typography>

          {activeStep === 0 && (
            <>
              <Typography variant="h6">
                <FormattedMessage id="common.publisherDetails.issn" />
              </Typography>

              {publisherTextFields.map((field) => {
                return (
                  <FormControl className="createListInnerContainer" key={field.value}>
                    <InputLabel>
                      <FormattedMessage id={field.label} />
                    </InputLabel>
                    <OutlinedInput
                      value={form[field.value] || ''}
                      onChange={(e) => updateForm({[field.value]: e.target.value})}
                      label={<FormattedMessage id={field.label} />}
                    />
                  </FormControl>
                );
              })}

              {/* Publisher's preferred language field */}
              <FormControl className="createListInnerContainer">
                <InputLabel>
                  <FormattedMessage id="form.common.language" />
                </InputLabel>
                <Select
                  label={<FormattedMessage id="form.common.language" />}
                  value={form.langCode || ''}
                  onChange={(e) => updateForm({langCode: e.target.value})}
                >
                  {langCodeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <FormattedMessage id={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Typography variant="h6">
                <FormattedMessage id="common.publicationDetails" />
              </Typography>
              {publicationTextFields.map((field) => {
                return (
                  <FormControl className="createListInnerContainer" key={field.value}>
                    <InputLabel>
                      <FormattedMessage id={field.label} />
                    </InputLabel>
                    <OutlinedInput
                      value={form[field.value] || ''}
                      onChange={(e) => updateForm({[field.value]: e.target.value})}
                      label={<FormattedMessage id={field.label} />}
                    />
                  </FormControl>
                );
              })}

              {/* Publication language field */}
              <FormControl className="createListInnerContainer">
                <InputLabel>
                  <FormattedMessage id="form.common.language" />
                </InputLabel>
                <Select
                  label={<FormattedMessage id="form.common.language" />}
                  value={form.language || ''}
                  onChange={(e) => updateForm({language: e.target.value})}
                >
                  {publishingLanguages.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label ? <FormattedMessage id={option.label} /> : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Publication medium field */}
              <FormControl className="createListInnerContainer">
                <InputLabel>
                  <FormattedMessage id="form.common.format" />
                </InputLabel>
                <Select
                  label={<FormattedMessage id="form.common.format" />}
                  value={form.medium || ''}
                  onChange={(e) => updateForm({medium: e.target.value})}
                >
                  {mediumOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label ? <FormattedMessage id={option.label} /> : ''}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          <MobileStepper
            className="issnMobileStepper"
            variant="text"
            steps={2}
            position="static"
            activeStep={activeStep}
            nextButton={
              <Button size="small" onClick={handleNext} disabled={activeStep === 1}>
                <FormattedMessage id="form.button.label.next" />
                <KeyboardArrowRight />
              </Button>
            }
            backButton={
              <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                <KeyboardArrowLeft />
                <FormattedMessage id="form.button.label.back" />
              </Button>
            }
          />

          {activeStep === 1 && (
            <div className="createListInnerContainer">
              <Button
                disabled={submitButtonIsDisabled()}
                variant="contained"
                color="success"
                onClick={handleApproveCreatingRequest}
              >
                <FormattedMessage id="form.button.label.submit" />
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseModal}>
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
            </div>
          )}
        </Box>
      </Modal>
    </>
  );
}

IssnRequestQuickFormModal.propTypes = {
  createIssnRequest: PropTypes.func.isRequired
};

export default IssnRequestQuickFormModal;
