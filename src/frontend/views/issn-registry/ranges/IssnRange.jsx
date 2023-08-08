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

function IssnRange(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  // Current range's id
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
    url: `/api/issn-registry/ranges/${id}`,
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

  const handleGoBack = () => {
    history.goBack();
  };

  async function handleDeleteRange() {
    await makeApiRequest({
      url: `/api/issn-registry/ranges/${range.id}`,
      method: 'DELETE',
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/issn-registry/ranges'
    });
  }

  async function handleOpenRange() {
    const result = await makeApiRequest({
      url: `/api/issn-registry/ranges/${range.id}/open`,
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
      url: `/api/issn-registry/ranges/${range.id}/close`,
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
      url: `/api/issn-registry/ranges/${range.id}/activate`,
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
      url: `/api/issn-registry/ranges/${range.id}/deactivate`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setRange(result);
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
    <Grid item xs={12} className="rangeContainer">
      <Typography variant="h5" className="rangesTitleColorISSN">
        <FormattedMessage id="ranges.range" /> - {id}
      </Typography>
      <div className="rangeButtonsContainer">
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.back'})}
          onClick={() => handleGoBack()}
        >
          <ArrowBackIcon />
        </Fab>
        {range.taken === 0 && (
          <Button
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleDeleteRange()}
          >
            <FormattedMessage id="form.button.label.delete" />
          </Button>
        )}
        {range.isClosed === false && (
          <Button
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleCloseRange()}
          >
            <FormattedMessage id="form.button.label.close" />
          </Button>
        )}
        {range.isClosed === true && (
          <Button
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleOpenRange()}
          >
            <FormattedMessage id="form.button.label.open" />
          </Button>
        )}
        {range.isActive === false && range.isClosed === false && (
          <Button
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleActivateRange()}
          >
            <FormattedMessage id="form.button.label.activate" />
          </Button>
        )}
        {range.isActive === true && (
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
      <Grid container spacing={3} className="rangeAndSubRangeContainer">
        <div className="mainContainer">
          <div className="listComponentContainer">
            <Typography variant="h6" className="listComponentContainerHeader">
              <FormattedMessage id="ranges.range.title" values={{part: '1/3'}} />
            </Typography>
            <ListComponent
              fieldName="id"
              label={<FormattedMessage id="ranges.range.id" />}
              value={range.id ?? ''}
            />
            <ListComponent
              fieldName="block"
              label={<FormattedMessage id="ranges.block" />}
              value={range.block ?? ''}
            />
            <ListComponent
              fieldName="rangeBegin"
              label={<FormattedMessage id="ranges.rangeBegin" />}
              value={`${range.block}-${range.rangeBegin}` ?? ''}
            />
            <ListComponent
              fieldName="rangeEnd"
              label={<FormattedMessage id="ranges.rangeEnd" />}
              value={`${range.block}-${range.rangeEnd}` ?? ''}
            />
          </div>
          <div className="listComponentContainer">
            <Typography variant="h6" className="listComponentContainerHeader">
              <FormattedMessage id="ranges.range.title" values={{part: '2/3'}} />
            </Typography>
            <ListComponent
              fieldName="free"
              label={<FormattedMessage id="ranges.range.free" />}
              value={range.free?.toString() ?? ''}
            />
            <ListComponent
              fieldName="taken"
              label={<FormattedMessage id="ranges.range.taken" />}
              value={range.taken?.toString() ?? ''}
            />
            <ListComponent
              fieldName="next"
              label={<FormattedMessage id="ranges.range.next" />}
              value={range.next ?? ''}
            />
            <ListComponent
              fieldName="isActive"
              label={<FormattedMessage id="ranges.range.isActive" />}
              value={
                range.isActive
                  ? intl.formatMessage({id: 'common.yes'})
                  : intl.formatMessage({id: 'common.no'})
              }
            />
            <ListComponent
              fieldName="isClosed"
              label={<FormattedMessage id="ranges.range.isClosed" />}
              value={
                range.isClosed
                  ? intl.formatMessage({id: 'common.yes'})
                  : intl.formatMessage({id: 'common.no'})
              }
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

IssnRange.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IssnRange);
