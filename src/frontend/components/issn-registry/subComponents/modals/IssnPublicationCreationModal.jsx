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

import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';
import {publishingLanguages, mediumOptions} from '/src/frontend/components/common/form/constants';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

const IssnPublicationCreationModal = (props) => {
  const {formId, userInfo, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  // State for the modal window
  const [openCreatePublicationModal, setOpenCreatePublicationModal] = useState(false);

  // State for the form fields
  const [publicationLanguage, setPublicationLanguage] = useState('');
  const [publicationMedium, setPublicationMedium] = useState('');
  const [publicationTitle, setPublicationTitle] = useState();
  const [publicationSubtitle, setPublicationSubtitle] = useState();
  const [publicationPlace, setPublicationPlace] = useState();

  // Event handlers for the modal window (open/close)
  const handleOpenCreatePublicationModal = () => setOpenCreatePublicationModal(true);

  const handleCloseCreatePublicationModal = () => {
    setOpenCreatePublicationModal(false);
  };

  // Handles approving a process of adding a new ISSN-publication
  async function handleApproveCreatingPublication() {
    setOpenCreatePublicationModal(false);

    // Data to be sent to the API
    const newPublication = {
      title: publicationTitle,
      subtitle: publicationSubtitle,
      language: publicationLanguage,
      medium: publicationMedium,
      placeOfPublication: publicationPlace
    };

    const result = await makeApiRequest({
      url: `/api/issn-registry/requests/${formId}/add-publication`,
      method: 'POST',
      values: newPublication,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      redirect(history, `/issn-registry/publications/${result.id}`);
    }
  }

  // Handlers for the form fields
  const handleChangeLanguage = (event) => {
    setPublicationLanguage(event.target.value);
  };

  const handleChangeMedium = (event) => {
    setPublicationMedium(event.target.value);
  };

  const handleChangeTitle = (event) => {
    setPublicationTitle(event.target.value);
  };

  const handleChangeSubtitle = (event) => {
    setPublicationSubtitle(event.target.value);
  };

  const handleChangePlace = (event) => {
    setPublicationPlace(event.target.value);
  };

  return (
    <>
      {/* Button that opens a modal for adding a new ISSN-publication */}
      <Button
        className="requestButton"
        variant="outlined"
        color="primary"
        onClick={handleOpenCreatePublicationModal}
      >
        <FormattedMessage id="form.button.label.addPublication" />
      </Button>
      <Modal
        open={openCreatePublicationModal}
        onClose={handleCloseCreatePublicationModal}
      >
        <Box className="createListModal">
          <div className="issnPublicationModalContainer">
            <Typography variant="h4">
              <FormattedMessage id="form.button.label.addPublication" />
            </Typography>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.title" />
              </InputLabel>
              <OutlinedInput
                value={publicationTitle || ''}
                onChange={handleChangeTitle}
                label={<FormattedMessage id="form.common.title" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.subtitle" />
              </InputLabel>
              <OutlinedInput
                value={publicationSubtitle || ''}
                onChange={handleChangeSubtitle}
                label={<FormattedMessage id="form.common.subtitle" />}
              />
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.language" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.language" />}
                value={publicationLanguage || ''}
                onChange={handleChangeLanguage}
              >
                {publishingLanguages.map((language) => (
                  <MenuItem key={language.value} value={language.value}>
                    {language.label === '' ? (
                      ''
                    ) : (
                      <FormattedMessage id={language.label} />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.format" />
              </InputLabel>
              <Select
                label={<FormattedMessage id="form.common.format" />}
                value={publicationMedium || ''}
                onChange={handleChangeMedium}
              >
                {mediumOptions.map((medium) => (
                  <MenuItem key={medium.value} value={medium.value}>
                    {medium.label === '' ? '' : <FormattedMessage id={medium.label} />}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="createListInnerContainer">
              <InputLabel>
                <FormattedMessage id="form.common.publicationCity" />
              </InputLabel>
              <OutlinedInput
                value={publicationPlace || ''}
                onChange={handleChangePlace}
                label={<FormattedMessage id="form.common.publicationCity" />}
              />
            </FormControl>
          </div>

          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              disabled={
                !publicationLanguage ||
                !publicationMedium ||
                !publicationTitle ||
                !publicationPlace
              }
              onClick={handleApproveCreatingPublication}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseCreatePublicationModal}
            >
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

IssnPublicationCreationModal.propTypes = {
  formId: PropTypes.number.isRequired,
  history: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
};

export default IssnPublicationCreationModal;
