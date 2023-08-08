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

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';

import {FormattedMessage, useIntl} from 'react-intl';
import {Grid, Typography, Button, Fab} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/identifierRanges/range.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ListComponent from '/src/frontend/components/common/ListComponent.jsx';

import {getIdentifiersAvailable, getIdentifiersUsed} from '/src/frontend/rangeFormattingUtils';

function IsmnRange(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const {id} = match.params;
  const intl = useIntl();

  const [range, setRange] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetching data of the current request
  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/ranges/ismn/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setRange(initialData);

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  // Handles back button click
  const handleGoBack = () => {
    history.goBack();
  };

  async function handleDeleteRange() {
    await makeApiRequest({
      url: `/api/isbn-registry/ranges/ismn/${range.id}`,
      method: 'DELETE',
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/isbn-registry/ranges/ismn'
    });
  }

  async function handleOpenRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/ranges/ismn/${range.id}/open`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setRange(result);
    }
  }

  async function handleCloseRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/ranges/ismn/${range.id}/close`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setRange(result);
    }
  }

  async function handleActivateRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/ranges/ismn/${range.id}/activate`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setRange(result);
    }
  }

  async function handleDeactivateRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/ranges/ismn/${range.id}/deactivate`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setRange(result);
    }
  }

  const buttons = (
    <div className="rangeButtonsContainer">
      <Fab
        color="secondary"
        size="small"
        title={intl.formatMessage({id: 'form.button.label.back'})}
        onClick={() => handleGoBack()}
      >
        <ArrowBackIcon />
      </Fab>
      {!(range.taken !== 0 || range.canceled !== 0) && (
        <Button
          className="buttons"
          variant="outlined"
          color="primary"
          onClick={() => handleDeleteRange()}
        >
          <FormattedMessage id="form.button.label.delete" />
        </Button>
      )}
      {!range.isClosed && (
        <Button
          className="buttons"
          variant="outlined"
          color="primary"
          onClick={() => handleCloseRange()}
        >
          <FormattedMessage id="form.button.label.close" />
        </Button>
      )}
      {range.isClosed &&
        getIdentifiersAvailable(range) &&
        getIdentifiersAvailable(range) !== '0' && (
        <Button
          className="buttons"
          variant="outlined"
          color="primary"
          onClick={() => handleOpenRange()}
        >
          <FormattedMessage id="form.button.label.open" />
        </Button>
      )}
      {!range.isActive && !range.isClosed && (
        <Button
          className="buttons"
          variant="outlined"
          color="primary"
          onClick={() => handleActivateRange()}
        >
          <FormattedMessage id="form.button.label.activate" />
        </Button>
      )}
      {range.isActive && (
        <Button
          className="buttons"
          variant="outlined"
          color="primary"
          onClick={() => handleDeactivateRange()}
        >
          <FormattedMessage id="form.button.label.deactivate" />
        </Button>
      )}
    </div>
  );

  const dataComponent = setDataComponent();

  function setDataComponent() {
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

    return(
      <Grid item xs={12} className="rangeContainer">
        <Typography variant="h5" className="rangesTitleColorISMN">
          <FormattedMessage id="ranges.range" /> - {id}
        </Typography>
        {buttons}
        <Grid container spacing={3} className="rangeAndSubRangeContainer">
          <div className="mainContainer">
            <div className="listComponentContainer">
              <Typography variant="h6" className="listComponentContainerHeader">
                <FormattedMessage id="ranges.range.title" values={{part: '1/3'}} />
              </Typography>
              <ListComponent
                fieldName="category"
                label={<FormattedMessage id="ranges.category" />}
                value={range.category ?? ''}
              />
              <ListComponent
                fieldName="language"
                label={<FormattedMessage id="ranges.range.isActive" />}
                value={intl.formatMessage({id: `common.${range.isActive}`}) ?? ''}
              />
              <ListComponent
                fieldName="language"
                label={<FormattedMessage id="ranges.range.isClosed" />}
                value={intl.formatMessage({id: `common.${range.isClosed}`}) ?? ''}
              />
              <ListComponent
                fieldName="prefix"
                label={<FormattedMessage id="ranges.prefix" />}
                value={range.prefix ?? ''}
              />
              <ListComponent
                fieldName="rangeBegin"
                label={<FormattedMessage id="ranges.rangeBegin" />}
                value={range.rangeBegin ?? ''}
              />
              <ListComponent
                fieldName="rangeEnd"
                label={<FormattedMessage id="ranges.rangeEnd" />}
                value={range.rangeEnd ?? ''}
              />
            </div>
            <div className="listComponentContainer">
              <Typography variant="h6" className="listComponentContainerHeader">
                <FormattedMessage id="ranges.range.title" values={{part: '2/3'}} />
              </Typography>
              <ListComponent
                fieldName="free"
                label={<FormattedMessage id="ranges.range.free" />}
                value={getIdentifiersAvailable(range)}
              />
              <ListComponent
                fieldName="taken"
                label={<FormattedMessage id="ranges.range.taken" />}
                value={getIdentifiersUsed(range)}
              />
            </div>
            <div className="listComponentContainer">
              <Typography variant="h6" className="listComponentContainerHeader">
                <FormattedMessage id="ranges.range.title" values={{part: '3/3'}} />
              </Typography>
              <ListComponent
                fieldName="timestamp"
                label={<FormattedMessage id="form.common.created" />}
                value={range.created ?? ''}
              />
              <ListComponent
                fieldName="createdBy"
                label={<FormattedMessage id="form.common.createdBy" />}
                value={range.createdBy ?? ''}
              />
              <ListComponent
                fieldName="timestamp"
                label={<FormattedMessage id="form.common.modified" />}
                value={range.modified ?? ''}
              />
              <ListComponent
                fieldName="modifiedBy"
                label={<FormattedMessage id="form.common.modifiedBy" />}
                value={range.modifiedBy ?? ''}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    );
  }

  return dataComponent;
}

IsmnRange.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IsmnRange);
