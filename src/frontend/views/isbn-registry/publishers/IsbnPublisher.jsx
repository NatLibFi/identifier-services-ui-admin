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

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useParams, withRouter} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';
import {FormattedMessage, useIntl} from 'react-intl';

import {Typography} from '@mui/material';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

// Hooks
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useDocumentTitle from '/src/frontend/hooks/useDocumentTitle';
import useItem from '/src/frontend/hooks/useItem';

// Actions
import {updateEntry} from '/src/frontend/actions';

// Styles
import '/src/frontend/css/common.css';

// Displays and forms
import IsbnPublisherEditForm from '/src/frontend/components/isbn-registry/publisher/IsbnPublisherEditForm.jsx';
import IsbnPublisherDisplay from '/src/frontend/components/isbn-registry/publisher/IsbnPublisherDisplay.jsx';
import IsbnPublisherDataComponent from '/src/frontend/components/isbn-registry/publisher/IsbnPublisherDataComponent.jsx';

// Data formatters
import {formatPublisherForEdit} from '/src/frontend/components/isbn-registry/publisher/utils';


function IsbnPublisher() {
  useDocumentTitle('common.publisherDetails.isbn');

  const intl = useIntl();
  const params = useParams();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const {id} = params;

  // Note: publisher information state for display and edit modes are kept separately
  // as formatting is currently required for edit mode
  const [publisher, setPublisher] = useState({});
  const [editFormattedPublisher, setEditFormattedPublisher] = useState({});

  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const hasPublisherData = useMemo(() => Object.keys(publisher).length > 0, [publisher]);

  const handleEditClick = useCallback(() => setIsEdit(true), [isEdit]);
  const handleCancel = useCallback(() => setIsEdit(false), [isEdit]);

  const dataComponent = useMemo(() => (<IsbnPublisherDataComponent isEdit={isEdit} publisher={publisher} />), [isEdit, publisher]);

  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/publishers/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [],
    prefetch: true,
    fetchOnce: true,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setPublisher(initialData);

    if (!initialLoading) {
      setLoading(false);
    }
  }, [initialData]);

  // Format publisher data for edit form whenever publisher data changes
  useEffect(() => {
    setEditFormattedPublisher(formatPublisherForEdit(publisher, intl));
  }, [publisher]);

  async function handlePublisherUpdate(values) {
    // Remove values that should not be updated
    /* eslint-disable no-unused-vars */
    const {
      activeIdentifierIsbn,
      activeIdentifierIsmn,
      isbnSubRanges,
      ismnSubRanges,
      confirmation,
      ...updateValues
    } = {
      ...values,
      // Ensure that empty values are also sent to the backend (to be able to clear them)
      additionalInfo: values.additionalInfo ? values.additionalInfo : '',
      // API expects those values to be strings
      classification: values.classification.map((item) => String(item.value)),
      previousNames: values.previousNames.map((item) => String(item.value))
    };
    /* eslint-enable no-unused-vars */

    const updateResult = await updateEntry({
      url: `/api/isbn-registry/publishers/${id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    // If update was successful, update data
    if (updateResult) {
      setPublisher(updateResult);
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
    <div className={'listItem'}>
      <Typography variant="h2" className="titleTopSticky normalTitle">
        {`${publisher.officialName} - `}
        <FormattedMessage id="common.publisherDetails.isbn" />
      </Typography>

      { /* Display data only */}
      {hasPublisherData && !isEdit && <IsbnPublisherDisplay
        publisher={publisher}
        handleEditClick={handleEditClick}
        dataComponent={dataComponent}
      />}

      { /* Edit data through form */}
      {hasPublisherData && isEdit && <IsbnPublisherEditForm
        publisher={editFormattedPublisher}
        onSubmit={handlePublisherUpdate}
        handleCancel={handleCancel}
        dataComponent={dataComponent}
      />}

    </div>
  );
}

export default withRouter(IsbnPublisher);
