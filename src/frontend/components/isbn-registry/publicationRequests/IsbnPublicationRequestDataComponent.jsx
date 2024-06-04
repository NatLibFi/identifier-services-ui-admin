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

import React, {useState, useEffect, useMemo, useReducer} from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage, useIntl} from 'react-intl';
import {useAuth} from 'react-oidc-context';

import {v4 as uuidv4} from 'uuid';

import {makeApiRequest} from '/src/frontend/actions';
import useList from '/src/frontend/hooks/useList';

import {
  Typography,
  IconButton,
  Link,
  Chip,
  Box,
  TextField,
  Autocomplete
} from '@mui/material';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DoneIcon from '@mui/icons-material/Done';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/dataComponent.css';

import ListComponent from '/src/frontend/components/common/ListComponent.jsx';
import {PUBLICATION_TYPES} from '/src/frontend/components/common/form/constants';
import SavePublisherModal from '/src/frontend/components/isbn-registry/subComponents/modals/SavePublisherModal/index.jsx';

import {publicationHasIdentifiers} from '/src/frontend/components/isbn-registry/publicationRequests/utils';
import {deepCompareObjects} from '/src/frontend/components/utils';

function IsbnPublicationRequestFormFields(props) {
  const {isEdit, hasIdentifiers, publicationRequest} = props;

  const intl = useIntl();

  const isEditable = (key) => {
    const nonEditableFields = ['modified', 'modifiedBy', 'created', 'createdBy'];
    const nonEditableAfterAccept = [
      'fileformat',
      'fileformatOther',
      'noIdentifierGranted',
      'onProcess',
      'printFormat',
      'publicationFormat',
      'publicationType',
      'publicationIdentifierElectronical',
      'publicationIdentifierPrint',
      'publicationIdentifierType',
      'publicationsIntra',
      'publicationsPublic',
      'publisherId',
      'publisherName',
      'publisherIdentifierString',
      'type',
      'typeOther'
    ];

    if (!isEdit) {
      return false;
    }

    return hasIdentifiers
      ? ![...nonEditableFields, ...nonEditableAfterAccept].includes(key)
      : !nonEditableFields.includes(key);
  };

  // Creating an array of authors to display
  const authorsArray = genAuthors([], 1);

  //Displaying all authors (4) in Edit Mode and only authors with filled info in Normal Mode
  function genAuthors(tempAuthorsArray, index) {
    if (index === 5) return tempAuthorsArray;

    if (isEdit) return genAuthors([...tempAuthorsArray, index], index + 1);

    if (
      publicationRequest[`lastName${index}`] !== '' &&
      publicationRequest[`firstName${index}`] !== null
    ) {
      return genAuthors([...tempAuthorsArray, index], index + 1);
    }

    return genAuthors(tempAuthorsArray, index + 1);
  }

  return (
    <>
      <div className='listComponentContainer'>
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.isbnIsmn.publisherInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('publisherIdentifierStr')}
          fieldName="publisherIdentifierStr"
          label={<FormattedMessage id="form.common.publisherIdentifier" />}
          value={publicationRequest.publisherIdentifierStr ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('officialName')}
          fieldName="officialName"
          label={<FormattedMessage id="form.common.name" />}
          value={publicationRequest.officialName}
        />
        <ListComponent
          edit={isEdit && isEditable('address')}
          fieldName="address"
          label={<FormattedMessage id="form.common.address" />}
          value={publicationRequest.address}
        />
        <ListComponent
          edit={isEdit && isEditable('zip')}
          fieldName="zip"
          label={<FormattedMessage id="form.common.zip" />}
          value={publicationRequest.zip}
        />
        <ListComponent
          edit={isEdit && isEditable('city')}
          fieldName="city"
          label={<FormattedMessage id="form.common.city" />}
          value={publicationRequest.city}
        />

        { // Display locality only for dissertations
          publicationRequest.publicationType === PUBLICATION_TYPES.DISSERTATION && (
            <ListComponent
              edit={isEdit && isEditable('locality')}
              fieldName="locality"
              label={<FormattedMessage id="request.publication.locality" />}
              value={publicationRequest.locality}
            />
          )
        }

        <ListComponent
          edit={isEdit && isEditable('phone')}
          fieldName="phone"
          label={<FormattedMessage id="form.common.phone" />}
          value={publicationRequest.phone}
        />
        <ListComponent
          edit={isEdit && isEditable('contactPerson')}
          fieldName="contactPerson"
          label={<FormattedMessage id="form.common.contactPerson" />}
          value={publicationRequest.contactPerson}
        />
        <ListComponent
          edit={isEdit && isEditable('email')}
          fieldName="email"
          label={<FormattedMessage id="form.common.email" />}
          value={publicationRequest.email}
        />
        <ListComponent
          edit={isEdit && isEditable('langCode')}
          fieldName="langCode"
          label={<FormattedMessage id="request.publication.contactLanguage" />}
          value={intl.formatMessage({id: `common.${publicationRequest.langCode}`})}
        />
      </div>

      {/* Julkaisun perustiedot - Publication basic information*/}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.basicInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('title')}
          fieldName="title"
          label={<FormattedMessage id="form.common.title" />}
          value={publicationRequest.title}
        />
        <ListComponent
          edit={isEdit && isEditable('subtitle')}
          fieldName="subtitle"
          label={<FormattedMessage id="form.common.subtitle" />}
          value={publicationRequest.subtitle}
        />
        <ListComponent
          edit={isEdit && isEditable('language')}
          fieldName="language"
          label={<FormattedMessage id="request.publication.publicationLanguage" />}
          value={intl.formatMessage({
            id: `common.${publicationRequest.language?.toLowerCase()}`
          })}
        />
        <ListComponent
          edit={isEdit && isEditable('publicationMonth')}
          fieldName="publicationMonth"
          label={<FormattedMessage id="form.common.publicationMonth" />}
          value={publicationRequest.month}
        />
        <ListComponent
          edit={isEdit && isEditable('publicationYear')}
          fieldName="publicationYear"
          label={<FormattedMessage id="form.common.publicationYear" />}
          value={publicationRequest.year}
        />
      </div>

      {/* Julkaisutoiminta - Publishing activities*/}
      {publicationRequest.publicationType !== PUBLICATION_TYPES.DISSERTATION && (
        <div className="listComponentContainer">
          <Typography variant="h6" className="listComponentContainerHeader">
            <FormattedMessage id="form.common.publishingActivities" />
          </Typography>
          <ListComponent
            edit={isEdit && isEditable('publishedBefore')}
            fieldName="publishedBefore"
            label={<FormattedMessage id="request.publication.previouslyPublished" />}
            value={
              publicationRequest.publishedBefore
                ? intl.formatMessage({id: 'common.yes'})
                : intl.formatMessage({id: 'common.no'})
            }
          />
          <ListComponent
            edit={isEdit && isEditable('publishingActivity')}
            fieldName="publishingActivity"
            label={<FormattedMessage id="form.common.frequency" />}
            value={
              publicationRequest.publishingActivity
                ? intl.formatMessage({
                  id: `form.isbnIsmn.publishingActivities.option.${publicationRequest.publishingActivity.toLowerCase()}`
                })
                : ''
            }
          />
          <ListComponent
            edit={isEdit && isEditable('publishingActivityAmount')}
            fieldName="publishingActivityAmount"
            label={<FormattedMessage id="request.publication.publishingFrequency" />}
            value={publicationRequest.publishingActivityAmount}
          />
        </div>
      )}

      {/* Julkaisumuoto - Format details*/}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.format" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('publicationFormat')}
          fieldName="publicationFormat"
          label={<FormattedMessage id="form.common.selectFormat" />}
          value={intl.formatMessage({id: `form.isbnIsmn.format.option.${publicationRequest.publicationFormat.toLowerCase()}`})}
        />
        <ListComponent
          edit={isEdit && isEditable('printFormat')}
          fieldName="printFormat"
          label={<FormattedMessage id="form.common.printFormat" />}
          value={publicationRequest.type}
        />
        <ListComponent
          edit={isEdit && isEditable('typeOther')}
          fieldName="typeOther"
          label={<FormattedMessage id="publisherRegistry.publisher.typeOther" />}
          value={publicationRequest.typeOther}
        />
        <ListComponent
          edit={isEdit && isEditable('printingHouse')}
          fieldName="printingHouse"
          label={<FormattedMessage id="publisherRegistry.publisher.manufacturer" />}
          value={publicationRequest.printingHouse}
        />
        <ListComponent
          edit={isEdit && isEditable('printingHouseCity')}
          fieldName="printingHouseCity"
          label={<FormattedMessage id="form.common.city" />}
          value={publicationRequest.printingHouseCity}
        />
        <ListComponent
          edit={isEdit && isEditable('copies')}
          fieldName="copies"
          label={<FormattedMessage id="publisherRegistry.publisher.run" />}
          value={publicationRequest.copies}
        />
        <ListComponent
          edit={isEdit && isEditable('edition')}
          fieldName="edition"
          label={<FormattedMessage id="publisherRegistry.publisher.edition" />}
          value={publicationRequest.edition}
        />
        <ListComponent
          edit={isEdit && isEditable('fileformat')}
          fieldName="fileformat"
          label={<FormattedMessage id="form.common.fileFormat" />}
          value={publicationRequest.fileformat}
        />
        <ListComponent
          edit={isEdit && isEditable('fileformatOther')}
          fieldName="fileformatOther"
          label={<FormattedMessage id="publisherRegistry.publisher.fileFormatOther" />}
          value={publicationRequest.fileformatOther}
        />
      </div>

      {/* Lisätiedot - Additional details*/}
      <div className="listComponentContainer listComponentAdditionalDetails">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.additionalDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('comments')}
          fieldName="comments"
          value={publicationRequest.comments}
        />
      </div>

      {/* Tekijät - Authors*/}
      <div className="listComponentContainer listComponentAuthors">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="request.publication.authors" />
        </Typography>
        {isEdit ? (
          <div className="authorsListEdit">
            {authorsArray?.map((author) => (
              <div key={uuidv4()} className="authorCardEdit">
                <div>{author}</div>
                <div>
                  <ListComponent
                    edit={isEdit}
                    fieldName={`firstName${author}`}
                    label={<FormattedMessage id="request.publication.givenName" />}
                    value={publicationRequest[`firstName${author}`] ?? ''}
                  />
                  <ListComponent
                    edit={isEdit}
                    fieldName={`lastName${author}`}
                    label={<FormattedMessage id="request.publication.familyName" />}
                    value={publicationRequest[`lastName${author}`] ?? ''}
                  />
                  <ListComponent
                    edit={isEdit}
                    fieldName={`role${author}`}
                    label={<FormattedMessage id="publisherRegistry.publisher.role" />}
                    value={publicationRequest[`role${author}`]}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="authorsList">
            {authorsArray?.map((author) => (
              <div key={uuidv4()}>
                <div className="authorsFirstName">
                  <Typography>
                    <FormattedMessage id="request.publication.givenName" />:
                  </Typography>
                  <Typography>{publicationRequest[`firstName${author}`]}</Typography>
                  <div>{author}</div>
                </div>
                <div className="authorsLastName">
                  <Typography>
                    <FormattedMessage id="request.publication.familyName" />:
                  </Typography>
                  <Typography>{publicationRequest[`lastName${author}`]}</Typography>
                </div>
                <div className="authorsRoles">
                  {publicationRequest[`role${author}`]?.map((item) => (
                    <Chip
                      key={item}
                      label={<FormattedMessage id={`form.isbnIsmn.authors.role.option.${item.toLowerCase()}`} />}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Julkaisun lisätiedot - Publication additional details*/}
      <div className="listComponentContainer listComponentPublicationDetails">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="common.publicationDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('publicationsPublic')}
          fieldName="publicationsPublic"
          label={<FormattedMessage id="request.publication.isPublic" />}
          value={intl.formatMessage({id: `common.${publicationRequest.publicationsPublic}`})}
        />
        <ListComponent
          edit={isEdit && isEditable('publicationsIntra')}
          fieldName="publicationsIntra"
          label={<FormattedMessage id="request.publication.publicationsIntra" />}
          value={intl.formatMessage({id: `common.${publicationRequest.publicationsIntra}`})}
        />
        <ListComponent
          edit={isEdit && isEditable('publicationType')}
          fieldName="publicationType"
          label={<FormattedMessage id="form.common.format" />}
          value={intl.formatMessage({id: `common.${publicationRequest.publicationType}`})}
          publication="isbn-ismn"
        />
        {publicationRequest.publicationType === 'MAP' && (
          <ListComponent
            edit={isEdit && isEditable('mapScale')}
            fieldName="mapScale"
            label={<FormattedMessage id="form.common.scale" />}
            value={publicationRequest.mapScale}
          />
        )}
      </div>

      {/* Sarjan tiedot - Series details*/}
      <div className="listComponentContainer listComponentSeriesDetails">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="request.publication.seriesDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('volume')}
          fieldName="volume"
          label={<FormattedMessage id="form.common.volume" />}
          value={publicationRequest.volume}
        />
        <ListComponent
          edit={isEdit && isEditable('series')}
          fieldName="series"
          label={<FormattedMessage id="form.common.title" />}
          value={publicationRequest.series}
        />
        <ListComponent
          edit={isEdit && isEditable('issn')}
          fieldName="issn"
          label={<FormattedMessage id="form.common.identifier" />}
          value={publicationRequest.issn}
        />
      </div>

      {/* Hakulomakkeen ylläpito - Form management*/}
      <div className="listComponentContainer listComponentFormManagement">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="request.publication.administration" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('noIdentifierGranted')}
          fieldName="noIdentifierGranted"
          label={<FormattedMessage id="request.publication.noIdentifierGranted" />}
          value={intl.formatMessage({id: `common.${publicationRequest.noIdentifierGranted}`})}
        />
        <ListComponent
          edit={isEdit && isEditable('onProcess')}
          fieldName="onProcess"
          label={<FormattedMessage id="request.publication.onProcess" />}
          value={intl.formatMessage({id: `common.${publicationRequest.onProcess}`})}
        />
      </div>

      {/* Muut tiedot - Other details*/}
      <div className="listComponentContainer listComponentOtherReference">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.otherInfo" />
        </Typography>
        <ListComponent
          edit={false}
          label={<FormattedMessage id="form.common.createdBy" />}
          value={publicationRequest.createdBy}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.created" />}
          value={publicationRequest.created}
        />
        <ListComponent
          edit={false}
          label={<FormattedMessage id="form.common.modifiedBy" />}
          value={publicationRequest.modifiedBy}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.modified" />}
          value={publicationRequest.modified}
        />
      </div>
    </>
  );
}

IsbnPublicationRequestFormFields.propTypes = {
  publicationRequest: PropTypes.object.isRequired,
  hasIdentifiers: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired
};

const MemoizedIsbnPublicationRequestFormFields = React.memo(IsbnPublicationRequestFormFields, deepCompareObjects);

function IsbnPublicationRequestDataComponent(props) {
  const {
    publicationRequest,
    setPublicationRequest,
    isEdit
  } = props;

  const intl = useIntl();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  // Publisher selected from the list
  const [publisher, setPublisher] = useState({});
  const [autocompleteInput, setAutocompleteInput] = useState('');
  const [autocompleteIsPristine, setAutocompleteIsPristine] = useState(true);

  // Modal for saving a publisher
  const [savePublisherModalOpen, setSavePublisherModalOpen] = useState(false);

  // Loading publishers for autocomplete
  // Component state
  const initialSearchBody = {searchText: ''};
  const hasIdentifiers = useMemo(() => publicationHasIdentifiers(publicationRequest), [publicationRequest]);

  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    // Refetch default when searchText has been emptied
    // Trigger autocomplete only after three or more characters
    if (next.searchText.length > 3 || next.searchText.length === 0) {
      return {...prev, ...next};
    }

    return prev;
  }, initialSearchBody);

  // Data fetching
  const {data: publishers, loading: isLoadingPublishers} = useList({
    url: '/api/isbn-registry/publishers/autocomplete',
    method: 'POST',
    body: searchBody,
    dependencies: [searchBody],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true,
    authenticationToken,
    modalIsUsed: true,
    isModalOpen: !isEdit
  });

  // List of existing publishers processed for the Autocomplete component
  const autoCompleteData = publishers.map((publisher) => ({
    label: publisher.officialName,
    value: publisher.id,
    otherNames: publisher.otherNames,
    previousNames: publisher.previousNames,
    // Used to help distinguish between ISBN and ISMN publishers with the same name
    isbnPublisher: publisher.isbnSubRanges?.length ? 'ISBN' : '',
    ismnPublisher: publisher.ismnSubRanges?.length ? 'ISMN' : ''
  }));

  // Reset pristine information when request changes
  useEffect(() => {
    setAutocompleteIsPristine(true);
  }, [publicationRequest]);

  /* Refreshes list from API */
  function updateSearchText(event, value, reason) {
    // During first event, set pristine to false
    if (autocompleteIsPristine && event) {
      setAutocompleteIsPristine(false);
    }

    // Manage autocomplete text state, search body state and publisher state
    // based on input type and value
    if (['input', 'reset'].includes(reason) && (value || value === '')) {
      if (reason === 'reset') {
        setAutocompleteInput({label: value, value: null});
      } else {
        // Note: used for autocomplete state value getter evaluation
        // Saving requires call of setPublisher function to set
        // publisher value that contains publisherId
        setAutocompleteInput({label: value, value: true});
      }

      if (value === '') {
        setPublisher({label: '', value: null});
      }

      return updateSearchBody({searchText: value});
    }
  }

  /* Handles change of a publisher */
  const handleChangePublisher = (_event, v) => {
    setPublisher(v);
  };

  const handleOpenSavePublisherModal = () => {
    setSavePublisherModalOpen(true);
  };

  // Handles closing the save publisher modal
  const handleCloseSavePublisherModal = () => {
    setSavePublisherModalOpen(false);

    // Reset publisher information as request is re-loaded and thus
    // autoComplete input resetted through useEffect
    setPublisher({label: '', value: null});
  };

  /* Handles resetting of a publisher */
  async function handleResetPublisher() {
    const requestBody = {publisherId: null};

    const updatedRequest = await makeApiRequest({
      url: `/api/isbn-registry/requests/publications/${publicationRequest.id}/set-publisher`,
      method: 'PUT',
      values: requestBody,
      authenticationToken,
      setSnackbarMessage
    });

    setPublicationRequest(updatedRequest);

    // Manually reset publisher and autocomplet input value so that state stays intact
    setPublisher({label: '', value: null});
    setAutocompleteInput('');
  }

  /* Identifier cancellation/removal handlers. Note: these will make redirect to same page using history.go(0) when process succeeds */
  async function cancelIdentifier(identifier) {
    await makeApiRequest({
      url: '/api/isbn-registry/identifiers/cancel',
      method: 'POST',
      values: {identifier},
      authenticationToken,
      setSnackbarMessage,
      history
    });
  }

  async function removeIdentifier(identifier) {
    await makeApiRequest({
      url: '/api/isbn-registry/identifiers/remove',
      method: 'POST',
      values: {identifier},
      authenticationToken,
      setSnackbarMessage,
      history
    });
  }

  // Getter for autocomplete value
  function getAutocompleteValue() {
    const requestPublisherValue = publicationRequest.publisherId ? {label: publicationRequest.publisherName, value: publicationRequest.publisherId} : {label: '', value: null};
    const currentPublisherValue = publisher.value ? publisher : {label: '', value: null};

    // If user has not started using autocomplete, display current request value
    if (autocompleteIsPristine) {
      return requestPublisherValue;
    }

    // If autocomplete input is ongoing, display it
    // Otherwise display selected publisher
    return autocompleteInput?.value ? autocompleteInput : currentPublisherValue;
  }

  function autocompleteHasSavedValue() {
    if (autocompleteIsPristine) {
      return true;
    }

    const requestPublisherValue = publicationRequest.publisherId || null;
    const currentPublisherValue = publisher.value || null;

    if (currentPublisherValue === requestPublisherValue) {
      return true;
    }

    return false;
  }

  return (
    <div className="mainContainer">
      {/* Kustantajan tiedot - Publisher details*/}
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="common.publisherDetails.isbn" />
        </Typography>
        {/* This component is related to choosing publisher from the list (ISBN/ISMN single request page) */}
        <div className="publisherInformationContainer">
          <div className="autoCompleteContainer">
            <div className="autoCompleteInnerContainer">
              <Autocomplete
                disableClearable
                clearOnBlur={false}
                /* List is disabled when request is already accepted */
                disabled={hasIdentifiers || isEdit}
                filterOptions={(x) => x} // Required for search-as-you-type
                renderOption={(props, option) => (
                  // NB! It is important to use a unique key for each option, since we can have multiple publishers with the same name (eg. ISBN & ISMN)
                  // That's why it is not possible to use a default key (props.key)
                  <li {...props} key={uuidv4()}>
                    <Box>
                      {/* Displaying publication type with the label when there are multiple publishers with the same name */}
                      {autoCompleteData.filter((item) => item.label === option.label)
                        .length > 1 ? (
                          <div>
                            {option.label}{' '}
                            <em>
                              ({option.isbnPublisher}
                              {option.ismnPublisher})
                            </em>
                          </div>
                        ) : (
                          option.label
                        )}
                      {option.otherNames && (
                        <p className="autocompleteAdditionalRow">
                          <FormattedMessage id="form.common.otherNames" />:{' '}
                          {option.otherNames}
                        </p>
                      )}
                      {option.previousNames?.length ? (
                        <p className="autocompleteAdditionalRow">
                          <FormattedMessage id="form.common.previousNames" />:{' '}
                          {option.previousNames.join(', ')}
                        </p>
                      ) : null}
                    </Box>
                  </li>
                )}
                options={autoCompleteData || []}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    focused
                    /* Warning (red) color in case of error,
                    Success (green) color in case of successfull save,
                    and Primary (blue) color by default */
                    color={hasIdentifiers ? 'success' : autocompleteHasSavedValue() ? 'primary' : 'error'}
                    helperText={autocompleteHasSavedValue() ? '' : intl.formatMessage({id: 'request.publication.autocomplete.notSaved'})}
                    size="small"
                    label={<FormattedMessage id="request.publication.choosePublisher" />}
                  />
                )}
                value={getAutocompleteValue()}
                getOptionLabel={(option) => option.label || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                onChange={handleChangePublisher}
                onInputChange={updateSearchText}
                loading={isLoadingPublishers}
              />
              <div>
                {/* Save-button is showed by default, Check-icon if request is accepted */}
                <IconButton
                  disabled={
                    isEdit ||
                    hasIdentifiers ||
                    !publisher.value ||
                    publisher.value === publicationRequest.publisherId
                  }
                  className={hasIdentifiers ? '' : 'iconButton'}
                  title={intl.formatMessage({id: 'form.button.label.save'})}
                  onClick={handleOpenSavePublisherModal}
                >
                  {hasIdentifiers ? (
                    <DoneIcon color="success" fontSize="large" />
                  ) : (
                    <SaveIcon color="primary" fontSize="large" />
                  )}
                </IconButton>
                <IconButton
                  disabled={hasIdentifiers || isEdit}
                  className="iconButton"
                  title={intl.formatMessage({id: 'form.button.label.reset'})}
                  onClick={handleResetPublisher}
                >
                  <ClearIcon
                    color={hasIdentifiers ? 'disabled' : 'primary'}
                    fontSize="large"
                  />
                </IconButton>
              </div>
            </div>
            {/* Displaying link to the publisher's details page */}
            <div className="publisherInformationLink">
              <AccountBoxIcon />
              <Link
                href={`/isbn-registry/publishers/${publisher.value ? publisher.value : publicationRequest.publisherId}`}
                target="_blank"
                rel="noreferrer"
              >
                <FormattedMessage id="common.publisherDetails.isbn" />
              </Link>
            </div>
          </div>
        </div>
        <SavePublisherModal
          publicationRequest={publicationRequest}
          publisherId={publisher.value} // Note: autocomplete formatting maps publisher.id to publisher.value
          setPublicationRequest={setPublicationRequest}
          savePublisherModalOpen={savePublisherModalOpen}
          setSavePublisherModalOpen={setSavePublisherModalOpen}
          handleCloseSavePublisherModal={handleCloseSavePublisherModal}
        />
      </div>

      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.identifiers" />
        </Typography>
        {publicationRequest.publicationIdentifierElectronical && (
          <ListComponent
            edit={false} // Never editable directly
            fieldName="publicationIdentifierElectronical"
            format="electronical"
            label={<FormattedMessage id="request.publication.electronic" />}
            value={publicationRequest.publicationIdentifierElectronical}
            cancelId={cancelIdentifier}
            removeId={removeIdentifier}
            token={authenticationToken}
          />
        )}
        {publicationRequest.publicationIdentifierPrint && (
          <ListComponent
            edit={false} // Never editable directly
            fieldName="publicationIdentifierPrint"
            format="print"
            label={<FormattedMessage id="request.publication.printed" />}
            value={publicationRequest.publicationIdentifierPrint}
            cancelId={cancelIdentifier}
            removeId={removeIdentifier}
            token={authenticationToken}
          />
        )}
      </div>

      <MemoizedIsbnPublicationRequestFormFields
        publicationRequest={publicationRequest}
        hasIdentifiers={hasIdentifiers}
        isEdit={isEdit}
      />
    </div>
  );
}

IsbnPublicationRequestDataComponent.propTypes = {
  publicationRequest: PropTypes.object.isRequired,
  setPublicationRequest: PropTypes.func.isRequired,
  isEdit: PropTypes.bool.isRequired
};

export default IsbnPublicationRequestDataComponent;
