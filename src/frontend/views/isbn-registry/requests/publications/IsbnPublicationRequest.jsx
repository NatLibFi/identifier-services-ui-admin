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

import React, {useEffect, useMemo, useState} from 'react';
import {useParams, withRouter} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import {FormattedMessage, useIntl} from 'react-intl';

import {Typography} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';

import IsbnPublicationRequestDataComponent from '/src/frontend/components/isbn-registry/publicationRequests/IsbnPublicationRequestDataComponent.jsx';
import IsbnPublicationRequestDisplay from '/src/frontend/components/isbn-registry/publicationRequests/IsbnPublicationRequestDisplay.jsx';
import IsbnPublicationRequestEditForm from '/src/frontend/components/isbn-registry/publicationRequests/IsbnPublicationRequestEditForm.jsx';
import {formatPublicationForEdit} from '/src/frontend/components/isbn-registry/publicationRequests/utils';

function IsbnPublicationRequest() {
  const intl = useIntl();
  const params = useParams();
  const {user: {access_token: authenticationToken}} = useAuth();

  const {id} = params;

  const [publicationRequest, setPublicationRequest] = useState({});
  const [editFormattedPublicationRequest, setEditFormattedPublicationRequest] = useState({});

  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const hasPublicationRequestData = useMemo(() => Object.keys(publicationRequest).length > 0, [publicationRequest]);

  // Fetching data of the current request
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/requests/publications/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setPublicationRequest(initialData);

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  // Format publicationRequest data for edit form whenever data changes
  useEffect(() => {
    setEditFormattedPublicationRequest(formatPublicationForEdit(publicationRequest, intl));
  }, [publicationRequest]);


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
      <div className="listItemSpinner">
        { /* Display data only */}
        {hasPublicationRequestData && !isEdit &&
          <IsbnPublicationRequestDisplay
            publicationRequest={publicationRequest}
            setIsEdit={setIsEdit}
          >
            <IsbnPublicationRequestDataComponent
              publicationRequest={publicationRequest}
              setPublicationRequest={setPublicationRequest}
              isEdit={isEdit}
            />
          </IsbnPublicationRequestDisplay>
        }

        { /* Edit data through form */}
        {hasPublicationRequestData && isEdit &&
          <IsbnPublicationRequestEditForm
            publicationRequest={editFormattedPublicationRequest}
            setPublicationRequest={setPublicationRequest}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          >
            <IsbnPublicationRequestDataComponent
              publicationRequest={publicationRequest}
              setPublicationRequest={setPublicationRequest}
              isEdit={isEdit}
            />
          </IsbnPublicationRequestEditForm>}
      </div>
    </div>
  );
}

export default withRouter(IsbnPublicationRequest);
