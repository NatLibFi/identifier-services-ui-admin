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

import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {useParams, withRouter} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {FormattedMessage, useIntl} from 'react-intl';

// Actions
import {updateEntry} from '/src/frontend/actions';

import {Typography} from '@mui/material';

// Hooks
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useDocumentTitle from '/src/frontend/hooks/useDocumentTitle';
import useItem from '/src/frontend/hooks/useItem';

// Styles
import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/publisher.css';

// Displays and forms
import IsbnPublisherRequestEditForm from '/src/frontend/components/isbn-registry/publisherRequests/IsbnPublisherRequestEditForm.jsx';
import IsbnPublisherRequestDisplay from '/src/frontend/components/isbn-registry/publisherRequests/IsbnPublisherRequestDisplay.jsx';
import IsbnPublisherRequestDataComponent from '/src/frontend/components/isbn-registry/publisherRequests/IsbnPublisherRequestDataComponent.jsx';


import Spinner from '/src/frontend/components/common/Spinner.jsx';

// Data formatters
import {formatPublisherForEdit} from '/src/frontend/components/isbn-registry/publisher/utils';


function IsbnPublisherRequest() {
  useDocumentTitle('common.requestDetails');

  const intl = useIntl();
  const params = useParams();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const {id} = params;

  // Note: state for display and edit modes are kept separately
  // as formatting is currently required for edit mode
  const [publisherRequest, setPublisherRequest] = useState({});
  const [editFormattedPublisherRequest, setEditFormattedPublisherRequest] = useState({});

  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const hasPublisherRequestData = useMemo(() => Object.keys(publisherRequest).length > 0, [publisherRequest]);

  const handleEditClick = useCallback(() => setIsEdit(true), [isEdit]);
  const handleCancel = useCallback(() => setIsEdit(false), [isEdit]);

  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/requests/publishers/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [],
    prefetch: true,
    fetchOnce: true,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setPublisherRequest(initialData);

    // End loading state when there actually is data
    if (!initialLoading) {
      setLoading(false);
    }
  }, [initialData]);

  // Format publisherRequest data for edit form whenever publisher data changes
  useEffect(() => {
    setEditFormattedPublisherRequest(formatPublisherForEdit(publisherRequest, intl));
  }, [publisherRequest]);

  async function handlePublisherRequestUpdate(values) {
    // Removing unnecessary values from the payload
    /* eslint-disable no-unused-vars */
    const {
      activeIdentifierIsbn,
      activeIdentifierIsmn,
      isbnSubRanges,
      ismnSubRanges,
      confirmation,
      yearQuitted,
      ...updateValues
    } = {
      ...values,
      // Ensure that blank values are also sent to the backend
      additionalInfo: values.additionalInfo ? values.additionalInfo : '',
      // API expects those values to be strings
      classification: values.classification.map((item) => String(item.value)),
      previousNames: values.previousNames.map((item) => String(item.value))
    };
    /* eslint-enable no-unused-vars */

    const updateResult = await updateEntry({
      url: `/api/isbn-registry/requests/publishers/${id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setPublisherRequest(updateResult);
    }

    setIsEdit(false);
  }

  if (error) {
    return (
      <Typography variant="h2" className="normalTitle">
        <FormattedMessage id="errorPage.message.defaultError" />
      </Typography>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="listItem">
      <Typography variant="h2" className="titleTopSticky normalTitle">
        {`${publisherRequest.officialName} - `}
        <FormattedMessage id="request.publisher.details" />
      </Typography>

      { /* Display data only */}
      {hasPublisherRequestData && !isEdit &&
        <IsbnPublisherRequestDisplay publisherRequest={publisherRequest} handleEditClick={handleEditClick}>
          <IsbnPublisherRequestDataComponent isEdit={isEdit} publisherRequest={publisherRequest} />
        </IsbnPublisherRequestDisplay>}

      { /* Edit data through form */}
      {hasPublisherRequestData && isEdit &&
        <IsbnPublisherRequestEditForm
          publisherRequest={editFormattedPublisherRequest}
          onSubmit={handlePublisherRequestUpdate}
          handleCancel={handleCancel}>
          <IsbnPublisherRequestDataComponent isEdit={isEdit} publisherRequest={publisherRequest} />
        </IsbnPublisherRequestEditForm>}
    </div>
  );
}

export default withRouter(IsbnPublisherRequest);
