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
import {useHistory} from 'react-router-dom';

import useList from '/src/frontend/hooks/useList';
import {createRequest} from '/src/frontend/actions';

import {
  Button,
  Typography,
  Modal,
  Box,
  FormControl,
  Autocomplete,
  TextField
} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

import {getIdentifiersAvailable} from '/src/frontend/rangeFormattingUtils';

function PublisherIdCreationModal(props) {
  const {publisherId, authenticationToken, setSnackbarMessage} = props;

  const history = useHistory();
  const intl = useIntl();

  // State for the modal window (open/close)
  const [openAddPublisherIdModal, setOpenAddPublisherIdModal] = useState(false);

  // State for assigning an ID to a publisher
  const [publisherIdentifierType, setPublisherIdentifierType] = useState(null);
  const [range, setRange] = useState(null);
  const [subRange, setSubRange] = useState(null);

  // State for displaying value label in the input fields (required for the Autocomplete component)
  const [inputValueType, setInputValueType] = useState('');
  const [inputValueRange, setInputValueRange] = useState('');
  const [inputValueSubRange, setInputValueSubRange] = useState('');

  // Range list state
  const {data: rangesList} = useList({
    url: `/api/isbn-registry/ranges/${publisherIdentifierType}`,
    method: 'GET',
    authenticationToken,
    dependencies: [publisherIdentifierType],
    prefetch: false,
    fetchOnce: false,
    requireAuth: true,
    isModalOpen: openAddPublisherIdModal,
    modalIsUsed: true
  });

  // Subrange list state
  const {data: subRangesList} = useList({
    url: `/api/isbn-registry/ranges/${publisherIdentifierType}/${range}/publisher-range-options`,
    method: 'GET',
    authenticationToken,
    dependencies: [range],
    prefetch: false,
    fetchOnce: false,
    requireAuth: true,
    isModalOpen: openAddPublisherIdModal,
    modalIsUsed: true
  });

  // Event handlers for the modal window (open/close)
  const handleOpenAddPublisherIdModal = () => setOpenAddPublisherIdModal(true);
  const handleCloseAddPublisherIdModal = () => {
    setOpenAddPublisherIdModal(false);
    // Reset all values when closing the modal
    setPublisherIdentifierType('');
    setRange(null);
    setSubRange(null);
    setInputValueType('');
    setInputValueRange('');
    setInputValueSubRange('');
  };

  // Handles changes to the type of an ID to be granted
  const handleChangePublisherIdentifierType = (_event, type) => {
    if (type === null) {
      setPublisherIdentifierType('');
      setRange(null);
      setSubRange(null);
      return;
    }

    setPublisherIdentifierType(type.value);
    setRange(null);
    setSubRange(null);
    setInputValueRange('');
    setInputValueSubRange('');
  };

  // Handles changes to the range of an ID to be granted
  const handleChangeRange = (_event, range) => {
    if (range === null) {
      setRange('');
      setSubRange('');
      return;
    }

    setRange(range.value);
    setSubRange('');
    setInputValueSubRange('');
  };

  // Handles changes to the ID to be granted
  const handleChangeSubRange = (_event, subRange) => {
    if (subRange === null) {
      setSubRange('');
      return;
    }

    setSubRange(subRange.value);
  };

  // Handles approving assigning of an ID to a publisher
  const handleApproveAddingPublisherId = async () => {
    const url = `/api/isbn-registry/publisher-ranges/${publisherIdentifierType}`;
    const redirectRoute = `/isbn-registry/publishers/${publisherId}`;

    const values = {
      publisherId,
      rangeId: range,
      // Selected identifier without prefix or langGroup, eg. 978-951-563 -> 563 (isbn) or 979-0-55012 -> 55012 (ismn)
      //NB. Subranges that were canceled earlier have values like 'can_1' and normal identifiers '979-0-55012'
      selectedPublisherIdentifier: subRange
    };

    await createRequest({
      values,
      url,
      history,
      redirectRoute,
      authenticationToken,
      setSnackbarMessage
    });

    setOpenAddPublisherIdModal(false);
    setPublisherIdentifierType('');
    setRange(null);
    setSubRange(null);
  };

  /* Lists of options for AutoComplete components */

  // List of range types
  const rangeTypesAutoComplete = [
    {value: 'isbn', label: 'ISBN'},
    {value: 'ismn', label: 'ISMN'}
  ];

  // List of ranges
  const rangesAutoComplete = rangesList
    .filter((range) => range.isActive) // Filter out inactive and closed ranges
    .filter((range) => !range.isClosed)
    .map((range) => ({
      value: range.id.toString(), // API requires range id as a string
      label:
        publisherIdentifierType === 'isbn'
          ? `${range.prefix}-${range.langGroup}: ${range.rangeBegin}-${range.rangeEnd
          } (${intl.formatMessage({id: 'ranges.range.free'})} ${getIdentifiersAvailable(
            range
          )})`
          : `${range.prefix}: ${range.rangeBegin}-${range.rangeEnd} (${intl.formatMessage(
            {id: 'ranges.range.free'}
          )} ${getIdentifiersAvailable(range)})`
    }));

  // List of subranges
  const subRangesAutoComplete = subRangesList
    .map((subRange) => ({
      value: subRange.value,
      label: subRange.identifier
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sorts the list of subranges by identifiers (labels)

  return (
    <>
      {/* Button that oppens a modal window */}
      <Button
        className="buttons"
        variant="outlined"
        color="primary"
        onClick={handleOpenAddPublisherIdModal}
      >
        {/* Buttons label changes depending on whether this is publisher request or already approved publisher (Grant/Add: Myönnä/Lisää) */}
        <FormattedMessage id={'form.button.label.assignId'} />
      </Button>
      {/* Modal window for adding new publisher identifier */}
      <Modal
        open={openAddPublisherIdModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        onClose={handleCloseAddPublisherIdModal}
      >
        <Box className="createListModal">
          <Typography variant="h6">
            <FormattedMessage id="form.button.label.createId" />
          </Typography>

          {/* Dropdown input for choosing a type of a subRange (ISBN/ISMN) */}
          <FormControl className="createListInnerContainer">
            <Autocomplete
              disablePortal
              options={rangeTypesAutoComplete}
              value={inputValueType || null}
              onChange={handleChangePublisherIdentifierType}
              inputValue={inputValueType}
              onInputChange={(_event, newInputValue) => setInputValueType(newInputValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={intl.formatMessage({id: 'form.common.subRangeType'})}
                />
              )}
            />
          </FormControl>

          {/* Dropdown input for choosing a range to use for granting a subRange */}
          {publisherIdentifierType && (
            <FormControl className="createListInnerContainer">
              <Autocomplete
                disablePortal
                options={rangesAutoComplete}
                value={inputValueRange || null}
                onChange={handleChangeRange}
                inputValue={inputValueRange}
                onInputChange={(_event, newInputValue) =>
                  setInputValueRange(newInputValue)
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={intl.formatMessage({id: 'ranges.range'})}
                  />
                )}
              />
            </FormControl>
          )}

          {/* Dropdown input for choosing a subRange to grant */}
          {range && (
            <FormControl className="createListInnerContainer">
              <Autocomplete
                disablePortal
                options={subRangesAutoComplete}
                value={inputValueSubRange || null}
                onChange={handleChangeSubRange}
                inputValue={inputValueSubRange}
                onInputChange={(_event, newInputValue) =>
                  setInputValueSubRange(newInputValue)
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={intl.formatMessage({id: 'form.common.publisherIdentifier'})}
                  />
                )}
              />
            </FormControl>
          )}

          {/* Displaying a message with an info about ID to be generated */}
          {publisherIdentifierType && range && subRange && (
            <Typography variant="h6" className="creatingIdMessage">
              <FormattedMessage
                id="modal.createId"
                values={{type: publisherIdentifierType.toUpperCase()}}
              />
              <p className="creatingIdSubRange">
                {subRangesList.find((item) => item.value === subRange).identifier}
              </p>
            </Typography>
          )}

          {/* Buttons for approving/rejecting the process of assigning of an ID to a publisher */}
          <div className="createListInnerContainer">
            <Button
              variant="contained"
              color="success"
              disabled={!publisherIdentifierType || !range || !subRange}
              onClick={handleApproveAddingPublisherId}
            >
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleCloseAddPublisherIdModal}
            >
              <FormattedMessage id="form.button.label.reject" />
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

PublisherIdCreationModal.propTypes = {
  publisherId: PropTypes.number.isRequired,
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
};

export default PublisherIdCreationModal;
