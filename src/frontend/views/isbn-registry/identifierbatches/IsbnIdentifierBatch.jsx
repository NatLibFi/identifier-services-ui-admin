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

import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import {FormattedMessage, useIntl} from 'react-intl';
import {Grid, Typography} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';
import {downloadFile, removeBatch} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/common.css';
import '/src/frontend/css/identifierRanges/batch.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import AdminDataComponent from '/src/frontend/components/isbn-registry/identifierRanges/isbn/Batch.jsx';

function IsbnIdentifierBatch(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const {id} = match.params;
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
    dependencies: [id, authenticationToken],
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

    if (result) {
      redirect(history, `/isbn-registry/publishers/${identifierBatch.publisherId}`);
    }
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
        />
      </Grid>
    </Grid>
  );

}

IsbnIdentifierBatch.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IsbnIdentifierBatch);
