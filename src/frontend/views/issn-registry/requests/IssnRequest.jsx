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

import {Typography} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';

import IssnRequestDataComponent from '/src/frontend/components/issn-registry/publicationRequests/IssnRequestDataComponent.jsx';
import IssnRequestButtonRow from '/src/frontend/components/issn-registry/publicationRequests/IssnRequestButtonRow.jsx';
import IssnRequestEditForm from '/src/frontend/components/issn-registry/publicationRequests/IssnRequestEditForm.jsx';


function IssnRequest() {
  const params = useParams();
  const {user: {access_token: authenticationToken}} = useAuth();

  const {id} = params;

  const [issnRequest, setIssnRequest] = useState({});

  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const hasPublicationRequestData = useMemo(() => Object.keys(issnRequest).length > 0, [issnRequest]);

  // Fetching data of the current request
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/issn-registry/requests/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setIssnRequest(initialData);

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

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
        {issnRequest.publisher ?? ''} - ISSN-
        <FormattedMessage id="common.requestDetails" />
      </Typography>
      <div className="listItem">
        <div className="listItemSpinner">
          { /* Display data only */}
          {hasPublicationRequestData && !isEdit &&
            <div>
              <IssnRequestButtonRow
                issnRequest={issnRequest}
                setIsEdit={setIsEdit}
              />
              <IssnRequestDataComponent
                issnRequest={issnRequest}
                setIssnRequest={setIssnRequest}
                isEdit={isEdit}
              />
            </div>
          }

          { /* Edit data through form */}
          {hasPublicationRequestData && isEdit &&
            <IssnRequestEditForm
              issnRequest={issnRequest}
              setIssnRequest={setIssnRequest}
              isEdit={isEdit}
              setIsEdit={setIsEdit}
            >
              <IssnRequestDataComponent
                issnRequest={issnRequest}
                setIssnRequest={setIssnRequest}
                isEdit={isEdit}
              />
            </IssnRequestEditForm>}
        </div>
      </div>
    </>
  );
}

export default withRouter(IssnRequest);
