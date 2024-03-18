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

import React, {useState, useEffect, useMemo} from 'react';
import {useParams, withRouter} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import {FormattedMessage} from 'react-intl';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';
import {updateEntry} from '/src/frontend/actions';

import {Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

import IssnPublisherDataComponent from '/src/frontend/components/issn-registry/publishers/IssnPublisherDataComponent.jsx';
import IssnPublisherDisplay from '/src/frontend/components/issn-registry/publishers/IssnPublisherDisplay.jsx';
import IssnPublisherEditForm from '/src/frontend/components/issn-registry/publishers/IssnPublisherEditForm.jsx';

import {formatFromAPI, formatToApi} from '/src/frontend/components/issn-registry/publishers/utils';


function IssnPublisher() {
  const {user: {access_token: authenticationToken}} = useAuth();

  const params = useParams();
  const {id} = params;

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const [issnPublisher, setIssnPublisher] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const hasData = useMemo(() => Object.keys(issnPublisher).length > 0, [issnPublisher]);

  // Fetching data of the current request
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/issn-registry/publishers/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setIssnPublisher(formatFromAPI(initialData));

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  /* Handles updating of the current publisher */
  async function handlePublisherUpdate(values) {
    const formattedValues = formatToApi(values);
    const updateResult = await updateEntry({
      url: `/api/issn-registry/publishers/${id}`,
      values: formattedValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnPublisher(formatFromAPI(updateResult));
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
      <Typography variant="h5" className="titleTopSticky">
        {`${issnPublisher.officialName} - `}
        <FormattedMessage id="common.publisherDetails.issn" />
      </Typography>
      { /* Display data only */}
      {hasData && !isEdit &&
        <IssnPublisherDisplay issnPublisher={issnPublisher} setIsEdit={setIsEdit}>
          <IssnPublisherDataComponent
            publisher={issnPublisher}
            handlePublisherUpdate={handlePublisherUpdate}
            isEdit={isEdit}
          />
        </IssnPublisherDisplay>
      }

      { /* Edit data through form */}
      {hasData && isEdit &&
        <IssnPublisherEditForm issnPublisher={issnPublisher} setIsEdit={setIsEdit} handlePublisherUpdate={handlePublisherUpdate}>
          <IssnPublisherDataComponent
            publisher={issnPublisher}
            handlePublisherUpdate={handlePublisherUpdate}
            isEdit={isEdit}
          />
        </IssnPublisherEditForm>
      }
    </div>
  );
}

export default withRouter(IssnPublisher);
