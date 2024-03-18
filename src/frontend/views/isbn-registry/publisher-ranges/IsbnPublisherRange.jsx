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

import React, {useState, useEffect} from 'react';

import {useAuth} from 'react-oidc-context';

import {useHistory, useParams, withRouter} from 'react-router-dom';
import {FormattedMessage, useIntl} from 'react-intl';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';

import {
  Grid,
  Typography,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '/src/frontend/css/common.css';
import '/src/frontend/css/identifierRanges/range.css';
import '/src/frontend/css/identifierRanges/subRange.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ListComponent from '/src/frontend/components/common/ListComponent.jsx';

import {getIdentifiersAvailable, getIdentifiersUsed} from '/src/frontend/rangeFormattingUtils';

function IsbnPublisherRange() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const params = useParams();
  const {id} = params;
  const intl = useIntl();

  const [subRange, setSubRange] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);

  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/publisher-ranges/isbn/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  useEffect(() => {
    setSubRange(initialData);

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
    // Check if deletable subRange is the last one, and in that case redirect to /publishers
    // otherwise redirect to /publishers/:publisherId
    const redirectRoute = history.location.state.publisherHasSubranges
      ? `/isbn-registry/publishers/${subRange.publisherId}`
      : `/isbn-registry/requests/publishers/${subRange.publisherId}`;

    await makeApiRequest({
      url: `/api/isbn-registry/publisher-ranges/isbn/${subRange.id}`,
      method: 'DELETE',
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute
    });
  }

  async function handleOpenRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/publisher-ranges/isbn/${subRange.id}/open`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setSubRange(result);
    }
  }

  async function handleCloseRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/publisher-ranges/isbn/${subRange.id}/close`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setSubRange(result);
    }
  }

  async function handleActivateRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/publisher-ranges/isbn/${subRange.id}/activate`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setSubRange(result);
    }
  }

  async function handleDeactivateRange() {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/publisher-ranges/isbn/${subRange.id}/deactivate`,
      method: 'POST',
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      setSubRange(result);
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
      <Typography variant="h5" className="subRangesTitleColor">
        <FormattedMessage id="form.common.publisherIdentifier" /> -{' '}
        {subRange.publisherIdentifier}
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
        {subRange.taken === 0 && (
          <>
            <Button
              disabled={subRange.taken !== 0}
              className="buttons"
              variant="outlined"
              color="primary"
              onClick={() => setCancelModalIsOpen(true)}
            >
              <FormattedMessage id="form.button.label.cancel" />
            </Button>
            <Dialog
              open={cancelModalIsOpen}
              onClose={() => setCancelModalIsOpen(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                <FormattedMessage id="ranges.subrange.cancel" />
              </DialogTitle>
              <DialogContent className="subRangeCancelText">
                <DialogContentText id="alert-dialog-description">
                  <FormattedMessage id="ranges.subrange.cancel.info" />
                </DialogContentText>
                <DialogContentText id="alert-dialog-description">
                  <FormattedMessage id="ranges.subrange.cancel.text" />
                </DialogContentText>
              </DialogContent>
              <DialogActions className="dialogButtons">
                <Button variant="contained" color="success" onClick={handleDeleteRange}>
                  <FormattedMessage id="common.yes" />
                </Button>
                <Button variant="contained" color="error" onClick={() => setCancelModalIsOpen(false)}>
                  <FormattedMessage id="common.no" />
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
        {!subRange.isClosed && (
          <Button
            disabled={subRange.isClosed}
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleCloseRange()}
          >
            <FormattedMessage id="form.button.label.closeRange" />
          </Button>
        )}
        {subRange.isClosed &&
          getIdentifiersAvailable(subRange) &&
          getIdentifiersAvailable(subRange) !== '0' && (
          <Button
            disabled={!subRange.isClosed}
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleOpenRange()}
          >
            <FormattedMessage id="form.button.label.open" />
          </Button>
        )}
        {!subRange.isClosed && !subRange.isActive && (
          <Button
            disabled={subRange.isClosed || subRange.isActive}
            className="buttons"
            variant="outlined"
            color="primary"
            onClick={() => handleActivateRange()}
          >
            <FormattedMessage id="form.button.label.activate" />
          </Button>
        )}
        {!subRange.isClosed && subRange.isActive && (
          <Button
            disabled={subRange.isClosed || !subRange.isActive}
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
              <FormattedMessage id="ranges.subrange.title" values={{part: '1/4'}} />
            </Typography>
            <ListComponent
              fieldName="category"
              label={<FormattedMessage id="ranges.category" />}
              value={subRange.category ?? ''}
            />
            <ListComponent
              fieldName="taken"
              label={<FormattedMessage id="ranges.range.taken" />}
              value={getIdentifiersUsed(subRange)}
            />
            {/* Note: number of available identifiers is actually derived from calculation of free + canceled, thus canceled is not separately displayed */}
            <ListComponent
              fieldName="free"
              label={<FormattedMessage id="ranges.range.free" />}
              value={getIdentifiersAvailable(subRange)}
            />
            <ListComponent
              fieldName="deleted"
              label={<FormattedMessage id="ranges.range.deleted" />}
              value={subRange.deleted?.toString() ?? ''}
            />
          </div>
          <div className="listComponentContainer">
            <Typography variant="h6" className="listComponentContainerHeader">
              <FormattedMessage id="ranges.subrange.title" values={{part: '2/4'}} />
            </Typography>
            <ListComponent
              fieldName="rangeBegin"
              label={<FormattedMessage id="ranges.rangeBegin" />}
              value={subRange.rangeBegin ?? ''}
            />
            <ListComponent
              fieldName="rangeEnd"
              label={<FormattedMessage id="ranges.rangeEnd" />}
              value={subRange.rangeEnd ?? ''}
            />
            <ListComponent
              fieldName="active"
              label={<FormattedMessage id="ranges.range.isActive" />}
              value={intl.formatMessage({id: `common.${subRange.isActive}`}) ?? ''}
            />
            <ListComponent
              fieldName="closed"
              label={<FormattedMessage id="ranges.range.isClosed" />}
              value={intl.formatMessage({id: `common.${subRange.isClosed}`}) ?? ''}
            />
          </div>
          <div className="listComponentContainer">
            <Typography variant="h6" className="listComponentContainerHeader">
              <FormattedMessage id="ranges.subrange.title" values={{part: '3/4'}} />
            </Typography>
            <ListComponent
              linkPath={`/isbn-registry/publishers/${subRange.publisherId}`}
              fieldName="publisher"
              label={<FormattedMessage id="common.publisher.isbn" />}
              value={'link'}
            />
          </div>
          <div className="listComponentContainer">
            <Typography variant="h6" className="listComponentContainerHeader">
              <FormattedMessage id="ranges.subrange.title" values={{part: '4/4'}} />
            </Typography>
            <ListComponent
              fieldName="timestamp"
              label={<FormattedMessage id="form.common.created" />}
              value={subRange.created ?? ''}
            />
            <ListComponent
              fieldName="createdBy"
              label={<FormattedMessage id="form.common.createdBy" />}
              value={subRange.createdBy ?? ''}
            />
            <ListComponent
              fieldName="timestamp"
              label={<FormattedMessage id="form.common.modified" />}
              value={subRange.modified ?? ''}
            />
            <ListComponent
              fieldName="modifiedBy"
              label={<FormattedMessage id="form.common.modifiedBy" />}
              value={subRange.modifiedBy ?? ''}
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
}

export default withRouter(IsbnPublisherRange);
