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

import React, {useReducer} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import {Typography, Autocomplete, Box, TextField, Link} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import {makeApiRequest} from '/src/frontend/actions';
import useList from '/src/frontend/hooks/useList';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/dataComponent.css';

import ListComponent from '/src/frontend/components/common/ListComponent.jsx';

function IssnRequestDataComponent(props) {
  const {issnRequest, setIssnRequest, isEdit, authenticationToken, setSnackbarMessage} =
    props;
  const intl = useIntl();

  // Autocomplete
  const initialSearchBody = {searchText: issnRequest.publisherName ?? ''};
  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    // Trigger autocomplete only after three or more characters
    if(next.searchText.length > 3) {
      return {...prev, ...next};
    }

    return prev;
  }, initialSearchBody);

  // Data fetching for autocomplete
  const {data: publishers, loading: isLoadingPublishers} = useList({
    url: '/api/issn-registry/publishers/autocomplete',
    method: 'POST',
    body: searchBody,
    dependencies: [searchBody],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true,
    authenticationToken,
    modalIsUsed: true,
    isModalOpen: !isEdit
  });

  // List of existing publishers processed for the Autocomplete component
  const autoCompleteData = [
    {label: '', value: null},
    ...publishers.map((publisher) => ({
      label: publisher.officialName,
      value: publisher.id
    }))
  ];

  /* Refreshes list from API */
  function updateSearchText(event) {
    if (event && event.target?.value && event.target.value !== searchBody.searchText) {
      updateSearchBody({searchText: event.target.value});
    }
  }

  /* Handles change of a publisher */
  const handleChangePublisher = (_event, publisher) => {
    handleSavePublisher(publisher?.value);
  };

  /* Handles saving of a publisher */
  async function handleSavePublisher(selectedPublisherId) {
    const publisherId = selectedPublisherId ? selectedPublisherId : null;

    const updatePublicationRequest = await makeApiRequest({
      url: `/api/issn-registry/requests/${issnRequest.id}/set-publisher`,
      method: 'PUT',
      values: {publisherId},
      authenticationToken,
      setSnackbarMessage
    });

    if (updatePublicationRequest) {
      setIssnRequest(updatePublicationRequest);
    }
  }

  /* Set non-editable fields */
  const isEditable = (key) => {
    const nonEditableFields = [
      'id',
      'publisherCreated',
      'publisherId',
      'publicationCount',
      'publicationCountIssn',
      'modified',
      'modifiedBy',
      'created',
      'createdBy'
    ];

    if (!isEdit) return false;

    return !nonEditableFields.includes(key);
  };

  return (
    <div className="mainContainer">
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.basicInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('id')}
          fieldName="id"
          label={<FormattedMessage id="common.id" />}
          value={issnRequest.id}
        />
        <ListComponent
          edit={isEdit && isEditable('formPublisher')}
          fieldName="publisher"
          label={<FormattedMessage id="request.issn.formPublisher" />}
          value={issnRequest.publisher}
        />
        {/* Render an Autocomplete component for choosing a publisher from the list of existing publishers */}
        <div className="publisherInformationContainer">
          <div className="autoCompleteInnerContainer">
            <Autocomplete
              disablePortal
              clearOnEscape
              clearOnBlur
              renderOption={(props, option) => (
                <li {...props}>
                  <Box>{option.label}</Box>
                </li>
              )}
              options={autoCompleteData || []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label={<FormattedMessage id="request.issn.choosePublisher" />}
                />
              )}
              value={issnRequest.publisherName || ' '}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleChangePublisher}
              onInputChange={updateSearchText}
              loading={isLoadingPublishers}
            />
          </div>
          {/* Displaying link to the publisher's details page when publisher is chosen from the list */}
          {issnRequest.publisherId && (
            <div className="publisherInformationLink">
              <AccountBoxIcon />
              <Link
                href={`/issn-registry/publishers/${issnRequest.publisherId}`}
                target="_blank"
                rel="noreferrer"
              >
                <FormattedMessage id="common.publisherDetails.issn" />
              </Link>
            </div>
          )}
        </div>
        <ListComponent
          edit={isEdit && isEditable('contactPerson')}
          fieldName="contactPerson"
          label={<FormattedMessage id="form.common.contactPerson" />}
          value={issnRequest.contactPerson}
        />
        <ListComponent
          edit={isEdit && isEditable('langCode')}
          fieldName="langCode"
          label={<FormattedMessage id="form.common.language" />}
          value={intl.formatMessage({id: `common.${issnRequest.langCode}`})}
        />
        <ListComponent
          edit={isEdit && isEditable('publisherId')}
          fieldName="publisherId"
          label={<FormattedMessage id="request.issn.publisherId" />}
          value={issnRequest.publisherId ?? intl.formatMessage({id: 'common.noValue'})}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="request.issn.contactInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('email')}
          fieldName="email"
          label={<FormattedMessage id="form.common.email" />}
          value={issnRequest.email}
        />
        <ListComponent
          edit={isEdit && isEditable('phone')}
          fieldName="phone"
          label={<FormattedMessage id="form.common.phone" />}
          value={issnRequest.phone}
        />
        <ListComponent
          edit={isEdit && isEditable('address')}
          fieldName="address"
          label={<FormattedMessage id="form.common.address" />}
          value={issnRequest.address}
        />
        <ListComponent
          edit={isEdit && isEditable('zip')}
          fieldName="zip"
          label={<FormattedMessage id="form.common.zip" />}
          value={issnRequest.zip}
        />
        <ListComponent
          edit={isEdit && isEditable('city')}
          fieldName="city"
          label={<FormattedMessage id="form.common.city" />}
          value={issnRequest.city}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="common.publicationDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('publicationCount')}
          fieldName="publicationCount"
          label={<FormattedMessage id="request.issn.publication_count" />}
          value={issnRequest.publicationCount?.toString() ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('publicationCountIssn')}
          fieldName="publicationCountIssn"
          label={<FormattedMessage id="request.issn.publication_count_issn" />}
          value={issnRequest.publicationCountIssn?.toString() ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('issnPublicationRequestStatus')}
          fieldName="issnPublicationRequestStatus"
          label={<FormattedMessage id="common.status" />}
          value={intl.formatMessage({id: `common.${issnRequest.status?.toLowerCase()}`})}
        />
        <ListComponent
          edit={isEdit && isEditable('publisherCreated')}
          fieldName="publisherCreated"
          label={<FormattedMessage id="request.issn.publisher_created" />}
          value={
            issnRequest.publisherCreated
              ? intl.formatMessage({id: 'common.yes'})
              : intl.formatMessage({id: 'common.no'})
          }
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.otherInfo" />
        </Typography>
        <ListComponent
          edit={false}
          label={<FormattedMessage id="form.common.createdBy" />}
          value={issnRequest.createdBy}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.created" />}
          value={issnRequest.created}
        />
        <ListComponent
          edit={false}
          label={<FormattedMessage id="form.common.modifiedBy" />}
          value={issnRequest.modifiedBy}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.modified" />}
          value={issnRequest.modified}
        />
      </div>
    </div>
  );
}

IssnRequestDataComponent.propTypes = {
  issnRequest: PropTypes.object.isRequired,
  setIssnRequest: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired,
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
};

export default IssnRequestDataComponent;
