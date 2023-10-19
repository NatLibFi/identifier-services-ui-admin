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
import PropTypes from 'prop-types';
import {Form} from 'react-final-form';
import {withRouter} from 'react-router-dom';
import {FormattedMessage, useIntl} from 'react-intl';

import useItem from '/src/frontend/hooks/useItem';
import {deleteEntry, updateEntry} from '/src/frontend/actions';

import {
  Button,
  Typography,
  Fab,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

import '/src/frontend/css/common.css';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

// Modals
import IssnMessagesModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnMessagesModal.jsx';
import IssnPublicationsModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublicationsModal.jsx';
import IssnPublishersRequestsModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublishersRequestsModal.jsx';

import IssnPublisherDataComponent from '/src/frontend/components/issn-registry/publishers/IssnPublisherDataComponent.jsx';
import {validate} from '/src/frontend/components/issn-registry/publishers/validate';
import {formatFromAPI, formatToApi} from '/src/frontend/components/issn-registry/publishers/utils';

function IssnPublisher(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const intl = useIntl();
  const {id} = match.params;

  const [issnPublisher, setIssnPublisher] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

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

  // EVENT HANDLERS
  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  const handleGoBack = () => {
    // Keep search state if previous page was search page
    if (history.location.state?.searchBody) {
      return history.push({
        pathname: '/issn-registry/publishers',
        state: {
          searchBody: history.location.state.searchBody
        }
      });
    }

    // Discard state since it was used already if necessary
    history.replace({state: {}});
    history.goBack();
  };

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

  /* Handles deleting of the current publisher */
  async function handleDeletePublisher() {
    await deleteEntry({
      url: `/api/issn-registry/publishers/${id}`,
      authenticationToken,
      history,
      redirectRoute: '/issn-registry/publishers',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  // Required to avoid textField focus issues on edit
  const dataComponent = (
    <IssnPublisherDataComponent
      publisher={issnPublisher}
      handlePublisherUpdate={handlePublisherUpdate}
      isEdit={isEdit}
      {...props}
    />);

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

  if (isEdit) {
    return (
      <div className="listItem">
        <Typography variant="h5" className="titleTopSticky">
          {`${issnPublisher?.officialName} - `}
          <FormattedMessage id="common.publisherDetails.issn" />
        </Typography>
        <Form
          onSubmit={handlePublisherUpdate}
          validate={validate}
          initialValues={issnPublisher}
        >
          {({handleSubmit}) => (
            <form onSubmit={handleSubmit}>
              <div className="updateButtonsContainer">
                <Button type="submit" variant="contained" color="success">
                  <FormattedMessage id="form.button.label.update" />
                </Button>
                <Button variant="contained" color="error" onClick={handleCancel}>
                  <FormattedMessage id="form.button.label.cancel" />
                </Button>
              </div>
              <div className="listItemSpinner">
                {dataComponent}
              </div>
            </form>
          )}
        </Form>
      </div>
    );
  }

  return (
    <div className="listItem">
      <Typography variant="h5" className="titleTopSticky">
        {`${issnPublisher.officialName} - `}
        <FormattedMessage id="common.publisherDetails.issn" />
      </Typography>
      <div className="issnPublisherButtonsContainer">
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.back'})}
          onClick={() => handleGoBack()}
        >
          <ArrowBackIcon />
        </Fab>
        {/* Modal for viewing publishers requests */}
        <IssnPublishersRequestsModal publisher={issnPublisher} {...props} />
        {/* Modal for viewing publishers publications */}
        <IssnPublicationsModal
          searchAttribute={'publisherId'}
          searchValue={issnPublisher.id}
          publisherName={issnPublisher.officialName}
          {...props}
        />
        {/* Modal for viewing publishers messages */}
        <IssnMessagesModal
          searchAttribute={'publisherId'}
          searchValue={issnPublisher.id}
          publisherName={issnPublisher.officialName}
          {...props}
        />
        {/* Pressing the delete button below causes opening of a confirmation Dialog */}
        <Fab
          disabled={issnPublisher.formId !== null && issnPublisher.formId !== 0}
          color="warning"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.delete'})}
          onClick={() => setDeleteModalIsOpen(true)}
        >
          <DeleteIcon />
        </Fab>
        <Dialog
          open={deleteModalIsOpen}
          onClose={() => setDeleteModalIsOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="publisher.issn.delete" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="publisher.issn.delete.approve" />
            </DialogContentText>
          </DialogContent>
          <DialogActions className="dialogButtons">
            <Button variant="contained" color="success" onClick={handleDeletePublisher}>
              <FormattedMessage id="form.button.label.approve" />
            </Button>
            <Button variant="contained" color="error" onClick={() => setDeleteModalIsOpen(false)}>
              <FormattedMessage id="form.button.label.cancel" />
            </Button>
          </DialogActions>
        </Dialog>
        {/* Edit mode - On/Off */}
        <Fab
          color="secondary"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.edit'})}
          onClick={handleEditClick}
        >
          <EditIcon />
        </Fab>
      </div>
      {dataComponent}
    </div>
  );
}

IssnPublisher.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IssnPublisher);
