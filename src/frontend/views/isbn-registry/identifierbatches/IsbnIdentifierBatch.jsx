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

import {useAuth} from 'react-oidc-context';

import {useHistory, useParams, withRouter} from 'react-router-dom';

import {FormattedMessage, useIntl} from 'react-intl';
import {Grid, Typography} from '@mui/material';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';
import {downloadFile, removeBatch} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/common.css';
import '/src/frontend/css/identifierRanges/batch.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import AdminDataComponent from '/src/frontend/components/isbn-registry/identifierRanges/isbn/Batch.jsx';

function IsbnIdentifierBatch() {
  const [showSpinner, setShowSpinner] = useState(true);

  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const params = useParams();
  const {id} = params;
  const intl = useIntl();

  // Fetching data of the current template
  const {
    data: identifierBatch,
    loading,
    error
  } = useItem({
    url: `/api/isbn-registry/identifierbatches/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Displaying different styles for different cases (isbn/ismn/non-authenticated)
  function getTitleStyle() {
    return identifierBatch.identifierType === 'ISBN'
      ? 'batchesTitleColor'
      : 'batchesTitleColorISMN';
  }

  async function downloadBatch(batchId) {
    await downloadFile({
      url: `/api/isbn-registry/identifierbatches/${batchId}/download`,
      method: 'POST',
      authenticationToken,
      downloadName: `isbnregistry-identifierbatch-${batchId}.txt`
    });
  }

  async function deleteBatch(batchId) {
    const result = await removeBatch({
      url: `/api/isbn-registry/identifierbatches/${batchId}`,
      method: 'DELETE',
      authenticationToken,
      setSnackbarMessage
    });

    // Redirect if delete process is finished successfully (result === true)
    if (result) {
      redirect(history, `/isbn-registry/publishers/${identifierBatch.publisherId}`);
    }

    // Hide spinner after delete process is finished unsuccessfully (result === false)
    setShowSpinner(result);
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
    <Grid item xs={12}>
      {identifierBatch.publisherName && (
        <Typography variant="h2" className={`${getTitleStyle()} normalTitle`}>
          <FormattedMessage id="common.batch" /> - {identifierBatch.publisherName}
        </Typography>
      )}
      <Grid container spacing={3} className="batchContainer">
        <AdminDataComponent
          identifierBatch={identifierBatch}
          downloadBatch={downloadBatch}
          deleteBatch={deleteBatch}
          authenticationToken={authenticationToken}
          intl={intl}
          history={history}
          showSpinner={showSpinner}
        />
      </Grid>
    </Grid>
  );

}

export default withRouter(IsbnIdentifierBatch);
