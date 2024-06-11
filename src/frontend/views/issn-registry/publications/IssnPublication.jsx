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

import {useAuth} from 'react-oidc-context';
import {useParams, withRouter} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import {Typography} from '@mui/material';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';
import {updateEntry} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import IssnPublicationDataComponent from '/src/frontend/components/issn-registry/publications/IssnPublicationDataComponent.jsx';
import IssnPublicationDisplay from '/src/frontend/components/issn-registry/publications/IssnPublicationDisplay.jsx';
import IssnPublicationEditForm from '/src/frontend/components/issn-registry/publications/IssnPublicationEditForm.jsx';

import {formatFromAPI, formatToApi} from '/src/frontend/components/issn-registry/publications/utils';

function IssnPublication() {
  const params = useParams();
  const {user: {access_token: authenticationToken}} = useAuth();

  const {id} = params;
  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const [failedUpdateCount, setFailedUpdateCount] = useState(0); // Dirty quickfix for state bug
  const [issnPublication, setIssnPublication] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const hasPublicationRequestData = useMemo(() => Object.keys(issnPublication).length > 0, [issnPublication]);

  // Fetching data of the current publication
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/issn-registry/publications/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id, failedUpdateCount],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setIssnPublication(formatFromAPI(initialData));

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  /* Handles updating of the current publication */
  async function handleUpdatePublication(values, token) {
    const formattedValues = formatToApi(values);
    const updateResult = await updateEntry({
      url: `/api/issn-registry/publications/${id}`,
      values: formattedValues,
      authenticationToken: token,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnPublication(formatFromAPI(updateResult));
      setIsEdit(false);
      return true;
    }

    // Quickfix to the state bug. A new request is made to avoid having situation where
    // view is not in sync with database state
    const newFailedUpdateCount = failedUpdateCount + 1;
    setFailedUpdateCount(newFailedUpdateCount);
  }

  const memoizedHandleUpdatePublication = useCallback(handleUpdatePublication, [id]);

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
    <>
      <Typography variant="h5" className="titleTopSticky">
        {issnPublication?.title ?? ''} - ISSN-
        <FormattedMessage id="common.publicationDetails" />
      </Typography>
      <div className="listItem">
        { /* Display data only */}
        {hasPublicationRequestData && !isEdit &&
          <IssnPublicationDisplay
            issnPublication={issnPublication}
            setLoading={setLoading}
            setIssnPublication={setIssnPublication}
            setIsEdit={setIsEdit}
          >
            <IssnPublicationDataComponent
              issnPublication={issnPublication}
              isEdit={isEdit}
              updatePublication={memoizedHandleUpdatePublication}
            />
          </IssnPublicationDisplay>
        }

        { /* Edit data through form */}
        {hasPublicationRequestData && isEdit &&
          <IssnPublicationEditForm
            issnPublication={issnPublication}
            handleUpdatePublication={memoizedHandleUpdatePublication}
            setIsEdit={setIsEdit}
          >
            <IssnPublicationDataComponent
              issnPublication={issnPublication}
              isEdit={isEdit}
              updatePublication={memoizedHandleUpdatePublication}
            />
          </IssnPublicationEditForm>
        }
      </div>
    </>
  );
}

export default withRouter(IssnPublication);
