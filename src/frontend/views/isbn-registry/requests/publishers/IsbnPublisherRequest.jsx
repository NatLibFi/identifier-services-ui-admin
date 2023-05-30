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

// Hooks
import useItem from '/src/frontend/hooks/useItem';

// Actions
import {deleteEntry, updateEntry} from '/src/frontend/actions';

import {
  Fab,
  Button,
  Typography,
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
import '/src/frontend/css/requests/publisher.css';

import PublisherIdCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublisherIdCreationModal.jsx';
import IsbnPublisherArchiveEntryModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublisherArchiveEntryModal.jsx';
import FormEditErrorCard from '/src/frontend/components/isbn-registry/subComponents/cards/FormEditErrorCard.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ListComponent from '/src/frontend/components/common/ListComponent.jsx';
import {classificationCodes} from '/src/frontend/components/common/form/constants';
import {validate} from '/src/frontend/components/isbn-registry/validatePublisherRequest';

function IsbnPublisherRequest(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const intl = useIntl();

  const {id} = match.params;

  const [publisherRequest, setPublisherRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/requests/publishers/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [],
    prefetch: true,
    fetchOnce: true,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setPublisherRequest(initialData);

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  async function handlePublisherUpdate(values) {
    // Removing unnecessary values from the payload
    /* eslint-disable no-unused-vars */
    const {
      activeIdentifierIsbn,
      activeIdentifierIsmn,
      isbnSubRanges,
      ismnSubRanges,
      confirmation,
      yearQuitted,
      ...updateValues
    } = {
      ...values,
      // Ensure that blank values are also sent to the backend
      additionalInfo: values.additionalInfo ? values.additionalInfo : '',
      // API expects those values to be strings
      classification: values.classification.map((item) => String(item.value)),
      previousNames: values.previousNames.map((item) => String(item.value))
    };
    /* eslint-enable no-unused-vars */

    const updateResult = await updateEntry({
      url: `/api/isbn-registry/requests/publishers/${id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setPublisherRequest(updateResult);
    }

    setIsEdit(false);
  }

  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  /* Handles going back to the previous page */
  const handleGoBack = () => {
    history.push({
      pathname: '/isbn-registry/requests/publishers',
      state: {
        // Sending the search input value back to the list page
        searchBody: history.location.state.searchBody
      }
    });
  };

  function isEditable(key) {
    const nonEditableFields = ['createdBy', 'created', 'modified', 'modifiedBy'];

    return isEdit && !nonEditableFields.includes(key);
  }

  /* Handles deleting of the current publisher request */
  async function handleDeleteRequest() {
    await deleteEntry({
      url: `/api/isbn-registry/requests/publishers/${id}`,
      authenticationToken,
      history,
      redirectRoute: '/isbn-registry/requests/publishers',
      setSnackbarMessage
    });

    setDeleteModalIsOpen(false);
  }

  const publisherRequestDetail = (
    <div className="mainContainer">
      {/* Kustantajan tiedot - Publisher information */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="common.publisherDetails.isbn" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="officialName"
          label={intl.formatMessage({id: 'form.common.name'})}
          value={publisherRequest.officialName ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="phone"
          label={intl.formatMessage({id: 'form.common.phone'})}
          value={publisherRequest.phone ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('langCode')}
          fieldName="langCode"
          label={intl.formatMessage({id: 'form.common.language'})}
          value={intl.formatMessage({id: `common.${publisherRequest.langCode}`}) ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="email"
          label={intl.formatMessage({id: 'form.common.email'})}
          value={publisherRequest.email ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="contactPerson"
          label={intl.formatMessage({id: 'form.common.contactPerson'})}
          value={publisherRequest.contactPerson ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="www"
          label={intl.formatMessage({id: 'form.common.website'})}
          value={publisherRequest.www ?? ''}
        />
      </div>

      {/* Postiosoite - Address */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.postalAddress" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="address"
          label={intl.formatMessage({id: 'form.common.address'})}
          value={publisherRequest.address ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('addressLine1')}
          fieldName="addressLine1"
          label={<FormattedMessage id="form.common.addressLine1" />}
          value={publisherRequest.addressLine1 ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="zip"
          label={intl.formatMessage({id: 'form.common.zip'})}
          value={publisherRequest.zip ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="city"
          label={intl.formatMessage({id: 'form.common.city'})}
          value={publisherRequest.city ?? ''}
        />
      </div>

      {/* Muut nimet - Other names */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.otherNames" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="otherNames"
          label={<FormattedMessage id="publisherRegistry.publisher.otherNameForms" />}
          value={publisherRequest.otherNames ?? ''}
        />
      </div>

      {/* Aikaiseemmat nimet - Previous names */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.previousNames" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="previousNames"
          label={<FormattedMessage id="publisherRegistry.publisher.previousNameForms" />}
          value={publisherRequest?.previousNames}
        />
        {publisherRequest?.previousNames?.length === 0 && !isEdit && (
          <ListComponent
            fieldName="previousNames"
            value={intl.formatMessage({
              id: 'publisherRegistry.publisher.noPreviousNames'
            })}
          />
        )}
      </div>

      {/* Kustannusaktiiivisuus - Publishing activity */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.frequency" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="frequencyCurrent"
          label={intl.formatMessage({id: 'form.common.currentYear'})}
          value={publisherRequest.frequencyCurrent ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="frequencyNext"
          label={intl.formatMessage({id: 'form.common.nextYear'})}
          value={publisherRequest.frequencyNext ?? ''}
        />
      </div>

      {/* Luokitus - Classification */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.classification" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="classification"
          label={<FormattedMessage id="form.common.classificationCodes" />}
          value={publisherRequest.classification ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="classificationOther"
          label={intl.formatMessage({id: 'form.common.classificationOther'})}
          value={publisherRequest.classificationOther ?? ''}
        />
      </div>

      {/* Lisätiedot - Additional details */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.additionalDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="additionalInfo"
          value={
            publisherRequest.additionalInfo?.length
              ? publisherRequest.additionalInfo
              : intl.formatMessage({id: 'form.common.noAdditionalDetails'})
          }
        />
      </div>

      {/* Organisaation lisätiedot - Organization details */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.organizationDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="affiliateOf"
          label={intl.formatMessage({id: 'form.common.affiliateOf'})}
          value={publisherRequest.affiliateOf ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="affiliates"
          label={intl.formatMessage({id: 'form.common.affiliates'})}
          value={publisherRequest.affiliates ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="distributorOf"
          label={intl.formatMessage({id: 'form.common.distributorOf'})}
          value={publisherRequest.distributorOf ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable}
          fieldName="distributors"
          label={intl.formatMessage({id: 'form.common.distributors'})}
          value={publisherRequest.distributors ?? ''}
        />
      </div>

      {/* Lomakkeen luontitiedot - Form creation details */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="request.publisher.created" />
        </Typography>
        <ListComponent
          fieldName="timestamp"
          label={intl.formatMessage({id: 'form.common.created'})}
          value={publisherRequest.created ?? ''}
        />
        <ListComponent
          label={intl.formatMessage({id: 'form.common.createdBy'})}
          value={publisherRequest.createdBy ?? ''}
        />
        <ListComponent
          label={intl.formatMessage({id: 'form.common.confirmation'})}
          value={publisherRequest.confirmation ?? ''}
        />
      </div>

      {/* Lomakkeen viimeisin päivitys - Form last updated */}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.updated" />
        </Typography>
        <ListComponent
          fieldName="timestamp"
          label={intl.formatMessage({id: 'form.common.modified'})}
          value={publisherRequest.modified ?? ''}
        />
        <ListComponent
          label={intl.formatMessage({id: 'form.common.modifiedBy'})}
          value={publisherRequest.modifiedBy ?? ''}
        />
      </div>
    </div>
  );

  const EditForm = () => {
    // Translates and edit classification values & previous names
    function formatInitialValues(values) {
      if (values && Object.keys(values).length > 0) {
        const formattedValues = {
          ...values,
          classification: values.classification
            .map((item) => formatClassificationForEditing(item))
            .map((item) => ({
              label: intl.formatMessage({id: item.label}),
              value: item.value
            })),
          previousNames: values.previousNames.map((item) => ({value: item, label: item}))
        };
        return formattedValues;
      }

      function formatClassificationForEditing(v) {
        return classificationCodes.find((item) => item.value === v);
      }
    }

    return (
      <Form
        onSubmit={handlePublisherUpdate}
        validate={validate}
        initialValues={formatInitialValues(publisherRequest)}
      >
        {({handleSubmit, valid, errors}) => (
          <form onSubmit={handleSubmit}>
            <div className="updateContainer">
              <div className="updateButtonsContainer">
                <Button onClick={handleCancel}>
                  <FormattedMessage id="form.button.label.cancel" />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!valid}
                >
                  <FormattedMessage id="form.button.label.update" />
                </Button>
              </div>
              {/* Display an error message if the form is not valid */}
              <FormEditErrorCard valid={valid} errors={errors} />
            </div>
            <div className="listItemSpinner">{publisherRequestDetail}</div>
          </form>
        )}
      </Form>
    );
  };

  const component = setComponent();

  function setComponent() {
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
      return <EditForm />;
    }

    return(
      <div className="listItem">
        <div className="publisherRequestButtons">
          <div className="publisherRequestButtonsInnerContainer">
            <Fab
              color="secondary"
              size="small"
              title={intl.formatMessage({id: 'form.button.label.back'})}
              onClick={() => handleGoBack()}
            >
              <ArrowBackIcon />
            </Fab>
            <PublisherIdCreationModal
              publisherId={id}
              authenticationToken={authenticationToken}
              setSnackbarMessage={setSnackbarMessage}
            />
            {/* Modal for viewing archive entry of publisher request (note, it's same entity as publisher archive record and thus same component) */}
            <IsbnPublisherArchiveEntryModal
              publisherId={publisherRequest.id}
              authenticationToken={authenticationToken}
            />
          </div>
          <div>
            {/* Pressing the delete button below causes opening of a confirmation Dialog */}
            <Fab
              disabled={
                publisherRequest.activeIdentifierIsbn !== '' ||
                publisherRequest.activeIdentifierIsmn !== ''
              }
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
                <FormattedMessage id="request.publisher.delete" />
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  <FormattedMessage id="request.publisher.delete.approve" />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteModalIsOpen(false)}>
                  <FormattedMessage id="form.button.label.cancel" />
                </Button>
                <Button onClick={handleDeleteRequest}>
                  <FormattedMessage id="form.button.label.approve" />
                </Button>
              </DialogActions>
            </Dialog>
            <Fab
              color="secondary"
              size="small"
              title={intl.formatMessage({id: 'form.button.label.edit'})}
              onClick={handleEditClick}
            >
              <EditIcon />
            </Fab>
          </div>
        </div>
        <div className="listItemSpinner">{publisherRequestDetail}</div>
      </div>
    );
  }

  return (
    <>
      <Typography variant="h5" className="titleTopSticky">
        <FormattedMessage id="request.publisher.details" />
      </Typography>
      {component}
    </>
  );
}

IsbnPublisherRequest.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IsbnPublisherRequest);
