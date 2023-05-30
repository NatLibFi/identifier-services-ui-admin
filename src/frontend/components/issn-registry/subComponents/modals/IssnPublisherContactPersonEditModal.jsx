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

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  Button,
  Fab,
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton
} from '@mui/material';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function IssnPublisherContactPersonEditModal(props) {
  const {initialState, attribute, edit, headerIntlId, handlePublisherUpdate} = props;
  const initialValues = initialState[attribute]
    ? initialState[attribute]
    : [{name: '', email: ''}];
  const intl = useIntl();

  // State for the modal window
  const [openModal, setOpenModal] = useState(false);
  const [values, setValues] = useState(initialValues);

  // Since loading is done in different way than in issn publication view,
  // we need to refresh values when initialValues are loaded
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  // Event handlers for the modal window
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    // Set initial state
    setValues(initialState[attribute]);
    setOpenModal(false);
  };

  const handleChangeValue = (e, idx, key) => {
    const updatedValues = [...values];
    updatedValues[idx][key] = e.target.value;

    setValues(updatedValues);
  };

  const addNewEntry = () => {
    if (values.length > 4) {
      return;
    }

    const newEntry = {name: '', email: ''};
    setValues([...values, newEntry]);
  };

  const removeEntry = (idx) => {
    if (values.length > 0) {
      const updatedValues = [...values];
      updatedValues.splice(idx, 1);

      setValues(updatedValues);
    }
  };

  // Handles approving a process of creating a new ISSN-publisher
  const handleUpdate = async () => {
    await handlePublisherUpdate({[attribute]: values});
    handleCloseModal();
  };

  return (
    <>
      {/* Button that opens a modal for adding a new ISSN request */}
      <Typography variant="h6" className="listComponentContainerHeader editableContainer">
        <FormattedMessage id={headerIntlId} />
        {edit && (
          <Fab
            aria-label={`edit-${attribute}`}
            onClick={handleOpenModal}
            color="info"
            size="small"
            className="issnPulisherContactsModalButton"
            title={intl.formatMessage({id: 'form.button.label.edit'})}
          >
            <PlaylistAddIcon />
          </Fab>
        )}
      </Typography>

      <Modal
        open={openModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseModal}
      >
        <Box className="createListModal issnLinkedPublicationEditModal">
          <Typography variant="h5">
            <FormattedMessage id={headerIntlId} />
          </Typography>
          {values.length === 0 && <FormattedMessage id={'common.undefined'} />}
          {[...Array(values.length).keys()].map((idx) => {
            return (
              <div
                key={idx}
                className="issnLinkedPublicationInnerContainer"
                style={{gridTemplateColumns: '0.1fr repeat(2, 2fr) 0.25fr'}}
              >
                <FormControl>
                  <InputLabel>
                    <FormattedMessage id={'common.name'} />
                  </InputLabel>
                  <OutlinedInput
                    value={values[idx]?.name || ''}
                    onChange={(e) => handleChangeValue(e, idx, 'name')}
                    label={<FormattedMessage id={'common.name'} />}
                  />
                </FormControl>

                <FormControl>
                  <InputLabel>
                    <FormattedMessage id={'form.common.email'} />
                  </InputLabel>
                  <OutlinedInput
                    value={values[idx]?.email || ''}
                    onChange={(e) => handleChangeValue(e, idx, 'email')}
                    label={<FormattedMessage id={'form.common.email'} />}
                  />
                </FormControl>

                <Fab onClick={() => removeEntry(idx)} color="warning" size="small">
                  <DeleteIcon />
                </Fab>
              </div>
            );
          })}

          {values.length < 5 ? (
            <IconButton
              aria-label="add"
              size="large"
              onClick={addNewEntry}
              title={intl.formatMessage({id: 'form.button.label.add'})}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          ) : (
            <Typography variant="h6">
              <FormattedMessage id={'modal.issn.linkedPublications.maxReached'} />
            </Typography>
          )}

          <div className="createListInnerContainer">
            <Button variant="contained" color="success" onClick={handleUpdate}>
              <FormattedMessage id="form.button.label.save" />
            </Button>
            <Button variant="contained" color="error" onClick={handleCloseModal}>
              <FormattedMessage id="form.button.label.cancel" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

IssnPublisherContactPersonEditModal.propTypes = {
  initialState: PropTypes.object.isRequired,
  attribute: PropTypes.string.isRequired,
  edit: PropTypes.bool.isRequired,
  headerIntlId: PropTypes.string.isRequired,
  handlePublisherUpdate: PropTypes.func.isRequired
};

export default IssnPublisherContactPersonEditModal;
