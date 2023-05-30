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

import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Form} from 'react-final-form';
import {FormattedMessage, useIntl} from 'react-intl';

import {Button, Typography, Fab} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Hooks
import useDocumentTitle from '/src/frontend/hooks/useDocumentTitle';
import useItem from '/src/frontend/hooks/useItem';

// Actions
import {updateEntry} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import {classificationCodes, MESSAGE_CODES} from '/src/frontend/components/common/form/constants';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

// Modals
import IsbnPublishersMessagesModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublishersMessagesModal.jsx';
import PublisherIdCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublisherIdCreationModal.jsx';
import PublisherListCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublisherListCreationModal.jsx';
import IsbnPublishersPublicationsModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublishersPublicationsModal.jsx';
import PublishersBatchIdsModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublishersBatchIdsModal.jsx';
import IsbnPublisherArchiveEntryModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublisherArchiveEntryModal.jsx';
import IsbnPublisherDataComponent from '/src/frontend/components/isbn-registry/publisher/IsbnPublisherDataComponent.jsx';
import {validate} from '/src/frontend/components/isbn-registry/publisher/validate';

function IsbnPublisher(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {isAuthenticated, authenticationToken} = userInfo;

  const intl = useIntl();

  const {id} = match.params;
  const componentRef = useRef();

  const [publisher, setPublisher] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const {
    data: initialData,
    loading: initialLoading,
    error
  } = useItem({
    url: `/api/isbn-registry/publishers/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [],
    prefetch: true,
    fetchOnce: true,
    requireAuth: true
  });

  // Set data to publisher during initial load
  useEffect(() => {
    setPublisher(initialData);

    // End loading state when there actually is data
    if (!initialLoading && Object.keys(initialData).length > 0) {
      setLoading(false);
    }
  }, [initialData]);

  // Set the title of the current page
  useDocumentTitle('common.publisherDetails.isbn');

  // EVENT HANDLERS
  const handleEditClick = () => {
    setIsEdit(true);
  };

  const handleCancel = () => {
    setIsEdit(false);
  };

  /* Handles going back to the previous page */
  const handleGoBack = () => {
    history.push({
      pathname: '/isbn-registry/publishers',
      state: {
        // Sending the search input value back to the list page
        searchBody: history.location.state.searchBody
      }
    });
  };

  const handleSendSubrangeMessage = (type) => {
    history.push({
      pathname: '/isbn-registry/messages/form/send',
      state: {
        messageCode:
          type === 'isbn'
            ? MESSAGE_CODES.SEND_SUBRANGE_ISBN
            : MESSAGE_CODES.SEND_SUBRANGE_ISMN,
        langCode: publisher.langCode,
        publisherId: publisher.id
      }
    });
  };

  async function handlePublisherUpdate(values) {
    // Remove values that should not be updated
    /* eslint-disable no-unused-vars */
    const {
      activeIdentifierIsbn,
      activeIdentifierIsmn,
      isbnSubRanges,
      ismnSubRanges,
      confirmation,
      ...updateValues
    } = {
      ...values,
      // Ensure that empty values are also sent to the backend (to be able to clear them)
      additionalInfo: values.additionalInfo ? values.additionalInfo : '',
      // API expects those values to be strings
      classification: values.classification.map((item) => String(item.value)),
      previousNames: values.previousNames.map((item) => String(item.value))
    };
    /* eslint-enable no-unused-vars */

    const updateResult = await updateEntry({
      url: `/api/isbn-registry/publishers/${id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    // If update was successful, update data
    if (updateResult) {
      setPublisher(updateResult);
    }

    setIsEdit(false);
  }

  // Lengths of active identifiers are used to determine if the message sending buttons should be shown
  const activeIsbnIdentifierCategory =
    publisher.activeIdentifierIsbn?.length > 0
      ? publisher.activeIdentifierIsbn.split('-')[2].length
      : 0;
  const activeIsmnIdentifierCategory =
    publisher.activeIdentifierIsmn?.length > 0
      ? publisher.activeIdentifierIsmn.split('-')[2].length
      : 0;

  const EditForm = () => {
    /* Format classification codes and previousNames since they are
      rendered as <Chip/> components and should appear in required format */
    function formatInitialValues(values) {
      if (values && Object.keys(values).length > 0) {
        const formattedValues = {
          ...values,
          classification: values.classification
            ? values.classification
              .map((item) => formatClassificationForEditing(item))
              .map((item) => ({
                label: item?.label && intl.formatMessage({id: item.label}),
                value: item?.value
              }))
            : [],
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
        initialValues={formatInitialValues(publisher)}
      >
        {({handleSubmit}) => (
          <form onSubmit={handleSubmit}>
            <div className="updateButtonsContainer">
              <Button onClick={handleCancel}>
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
              <Button type="submit" variant="contained" color="primary">
                <FormattedMessage id="form.button.label.update" />
              </Button>
            </div>
            <div className="listItemSpinner">{dataComponent}</div>
          </form>
        )}
      </Form>
    );
  };

  // COMPONENT GENERATION
  // - Consists of data component and buttons which act as event dispatchers
  const dataComponent = (
    <IsbnPublisherDataComponent isEdit={isEdit} publisher={publisher} history={history} intl={intl} />
  );

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
      return (
        <div className="listItem">
          <Typography variant="h2" className="titleTopSticky normalTitle">
            {`${publisher.officialName} - `}
            <FormattedMessage id="common.publisherDetails.isbn" />
          </Typography>
          <EditForm />
        </div>
      );
    }

    return (
      <div className={'listItem'}>
        <Typography variant="h2" className="titleTopSticky normalTitle">
          {`${publisher.officialName} - `}
          <FormattedMessage id="common.publisherDetails.isbn" />
        </Typography>
        {isAuthenticated && (
          <div className="publisherButtonsContainer">
            <Fab
              color="secondary"
              size="small"
              title={intl.formatMessage({id: 'form.button.label.back'})}
              onClick={() => handleGoBack()}
            >
              <ArrowBackIcon />
            </Fab>
            {/* Modals for adding id's and batches */}
            <PublisherIdCreationModal
              publisherId={id}
              authenticationToken={authenticationToken}
              setSnackbarMessage={setSnackbarMessage}
            />
            <PublisherListCreationModal
              publisherId={id}
              publisher={publisher}
              authenticationToken={authenticationToken}
              setSnackbarMessage={setSnackbarMessage}
              history={history}
            />
            {/* Send ISBN Subrange information for category 5 ISBN subranges */}
            {activeIsbnIdentifierCategory === 5 && (
              <Button
                className="buttons"
                variant="outlined"
                color="primary"
                onClick={() => handleSendSubrangeMessage('isbn')}
              >
                <FormattedMessage
                  id="publisherRegistry.publisher.sendMessage"
                  values={{type: 'ISBN', category: '5'}}
                />
              </Button>
            )}
            {/* Send ISMN Subrange information for category 7 ISMN subranges */}
            {activeIsmnIdentifierCategory === 7 && (
              <Button
                className="buttons"
                variant="outlined"
                color="primary"
                onClick={() => handleSendSubrangeMessage('ismn')}
              >
                <FormattedMessage
                  id="publisherRegistry.publisher.sendMessage"
                  values={{type: 'ISMN', category: '7'}}
                />
              </Button>
            )}
            {/* Modal for viewing publishers messages */}
            <IsbnPublishersMessagesModal
              publisher={publisher}
              authenticationToken={authenticationToken}
              history={history}
            />
            {/* Modal for viewing publishers publications (accepted) */}
            <IsbnPublishersPublicationsModal
              publisher={publisher}
              authenticationToken={authenticationToken}
              history={history}
            />
            {/* Modal for viewing publishers batches */}
            <PublishersBatchIdsModal
              publisher={publisher}
              authenticationToken={authenticationToken}
              history={history}
            />
            {/* Modal for viewing archive entry of publisher */}
            <IsbnPublisherArchiveEntryModal
              publisherId={publisher.id}
              authenticationToken={authenticationToken}
            />
            <Fab
              color="secondary"
              size="small"
              title={intl.formatMessage({id: 'publisherRegistry.publisher.editUser'})}
              onClick={handleEditClick}
            >
              <EditIcon />
            </Fab>
          </div>
        )}
        <div ref={componentRef}>{dataComponent}</div>
      </div>
    );
  }

  return component;
}

IsbnPublisher.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IsbnPublisher);
