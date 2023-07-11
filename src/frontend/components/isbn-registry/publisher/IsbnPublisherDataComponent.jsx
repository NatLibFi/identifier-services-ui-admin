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
import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import PropTypes from 'prop-types';
import {Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/publishers.css';

import ListComponent from '/src/frontend/components/common/ListComponent.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';

function IsbnPublisherDataComponent({isEdit, publisher, clearFields, history, intl}) {
  const headRowsPublisherIdentifier = [
    {id: 'publisherIdentifier', intlId: 'form.common.identifier'},
    {id: 'free', intlId: 'table.headRows.free'},
    {id: 'isActive', intlId: 'table.headRows.active'},
    {id: 'created', intlId: 'table.headRows.created'}
  ];

  function isEditable(key) {
    const nonEditableFields = ['lastUpdated', 'isbnRange', 'ismnRange', 'request'];

    return isEdit && !nonEditableFields.includes(key);
  }

  const publisherHasSubranges =
    publisher.isbnSubRanges?.length > 1 || publisher.ismnSubRanges?.length > 1;

  const handleTableRowClickIsbn = (id) => {
    // Sending boolean value depending on if publisher has subRanges (used for redirect purposes)
    history.push(`/isbn-registry/publisher-ranges/isbn/${id}`, {
      publisherHasSubranges: publisherHasSubranges
    });
    window.scroll(0, 0);
  };

  const handleTableRowClickIsmn = (id) => {
    // Sending boolean value depending on if publisher has subRanges (used for redirect purposes)
    history.push(`/isbn-registry/publisher-ranges/ismn/${id}`, {
      publisherHasSubranges: publisherHasSubranges
    });
    window.scroll(0, 0);
  };

  // Format created date for displaying in table
  const formattedDate = (date) => {
    return moment(date).format('DD.MM.YYYY');
  };

  return (
    <div className="mainContainer">
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.basicInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('officialName')}
          fieldName="officialName"
          label={<FormattedMessage id="form.common.name" />}
          value={publisher.officialName ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('phone')}
          fieldName="phone"
          label={<FormattedMessage id="form.common.phone" />}
          value={publisher.phone ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('langCode')}
          fieldName="langCode"
          label={<FormattedMessage id="form.common.language" />}
          value={
            intl.formatMessage({id: `form.publishersLanguages.${publisher.langCode}`}) ??
            ''
          }
        />
        <ListComponent
          edit={isEdit && isEditable('email')}
          fieldName="email"
          label={<FormattedMessage id="form.common.email" />}
          value={publisher.email ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('contactPerson')}
          fieldName="contactPerson"
          label={<FormattedMessage id="form.common.contactPerson" />}
          value={publisher.contactPerson ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('website')}
          fieldName="www"
          label={<FormattedMessage id="form.common.website" />}
          value={publisher.www ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.postalAddress" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('address')}
          fieldName="address"
          label={<FormattedMessage id="form.common.address" />}
          value={publisher.address ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('addressLine1')}
          fieldName="addressLine1"
          label={<FormattedMessage id="form.common.addressLine1" />}
          value={publisher.addressLine1 ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('city')}
          fieldName="city"
          label={<FormattedMessage id="form.common.city" />}
          value={publisher.city ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('zip')}
          fieldName="zip"
          label={<FormattedMessage id="form.common.zip" />}
          value={publisher.zip ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.publisherIdentifiers" />
        </Typography>
        <ListComponent
          edit={false}
          fieldName="activeIdentifierIsbn"
          label={
            <FormattedMessage id="form.common.activeIdentifier" values={{type: 'ISBN'}} />
          }
          value={publisher.activeIdentifierIsbn ?? ''}
        />
        <ListComponent
          edit={false}
          fieldName="activeIdentifierIsmn"
          label={
            <FormattedMessage id="form.common.activeIdentifier" values={{type: 'ISMN'}} />
          }
          value={publisher.activeIdentifierIsmn ?? ''}
        />
        {publisher.isbnSubRanges?.length ? (
          <>
            <Typography variant="h5" className="subRangeTitle">
              ISBN
            </Typography>
            <TableComponent
              data={publisher.isbnSubRanges.map((subRange) => {
                return {
                  ...subRange,
                  free: subRange.free + subRange.canceled,
                  created: formattedDate(subRange.created)
                };
              })}
              handleTableRowClick={handleTableRowClickIsbn}
              headRows={headRowsPublisherIdentifier}
            />
          </>
        ) : (
          ''
        )}
        {publisher.ismnSubRanges?.length ? (
          <>
            <Typography variant="h5" className="subRangeTitle">
              ISMN
            </Typography>
            <TableComponent
              data={publisher.ismnSubRanges.map((subRange) => {
                return {
                  ...subRange,
                  free: subRange.free + subRange.canceled,
                  created: formattedDate(subRange.created)
                };
              })}
              handleTableRowClick={handleTableRowClickIsmn}
              headRows={headRowsPublisherIdentifier}
            />
          </>
        ) : (
          ''
        )}
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.organizationDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('affiliates')}
          fieldName="affiliates"
          label={<FormattedMessage id="form.common.affiliates" />}
          value={publisher.affiliates ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('affiliateOf')}
          fieldName="affiliateOf"
          label={<FormattedMessage id="form.common.affiliateOf" />}
          value={publisher.affiliateOf ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('distributors')}
          fieldName="distributors"
          label={<FormattedMessage id="form.common.distributors" />}
          value={publisher.distributors ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('distributorOf')}
          fieldName="distributorOf"
          label={<FormattedMessage id="form.common.distributorOf" />}
          value={publisher.distributorOf ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.otherNames" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('otherNames')}
          fieldName="otherNames"
          clearFields={clearFields}
          label={<FormattedMessage id="publisherRegistry.publisher.otherNameForms" />}
          value={publisher.otherNames ?? ''}
        />
        {publisher?.otherNames?.length === 0 && !isEdit && (
          <ListComponent
            fieldName="otherNames"
            value={intl.formatMessage({id: 'publisherRegistry.publisher.noOtherNames'})}
          />
        )}
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.previousNames" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('previousNames')}
          fieldName="previousNames"
          clearFields={clearFields}
          label={<FormattedMessage id="publisherRegistry.publisher.previousNameForms" />}
          value={publisher.previousNames ?? ''}
        />
        {publisher?.previousNames?.length === 0 && !isEdit && (
          <ListComponent
            fieldName="previousNames"
            value={intl.formatMessage({
              id: 'publisherRegistry.publisher.noPreviousNames'
            })}
          />
        )}
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.frequency" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('frequencyCurrent')}
          fieldName="frequencyCurrent"
          label={<FormattedMessage id="form.common.currentYear" />}
          value={publisher.frequencyCurrent ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('frequencyNext')}
          fieldName="frequencyNext"
          label={<FormattedMessage id="form.common.nextYear" />}
          value={publisher.frequencyNext ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.classification" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('classification')}
          fieldName="classification"
          clearFields={clearFields}
          label={<FormattedMessage id="form.common.classificationCodes" />}
          value={publisher.classification ?? []}
        />
        <ListComponent
          edit={isEdit && isEditable('classificationOther')}
          fieldName="classificationOther"
          label={<FormattedMessage id="form.common.classificationOther" />}
          value={publisher.classificationOther ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.activity" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('hasQuitted')}
          fieldName="hasQuitted"
          label={
            <FormattedMessage id="publisherRegistry.publisher.publisherHasQuitted" />
          }
          value={
            publisher.hasQuitted
              ? intl.formatMessage({id: 'common.yes'})
              : intl.formatMessage({id: 'common.no'})
          }
        />
        <ListComponent
          edit={isEdit && isEditable('yearQuitted')}
          fieldName="yearQuitted"
          label={<FormattedMessage id="publisherRegistry.publisher.yearInactivated" />}
          value={
            !publisher.hasQuitted && publisher.yearQuitted === ''
              ? intl.formatMessage({id: 'publisherRegistry.publisher.publisherIsActive'})
              : publisher.yearQuitted
          }
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.additionalDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('promoteSorting')}
          fieldName="promoteSorting"
          label={<FormattedMessage id="publisherRegistry.publisher.promoteSorting" />}
          value={
            publisher.promoteSorting
              ? intl.formatMessage({id: 'common.yes'})
              : intl.formatMessage({id: 'common.no'})
          }
        />
        <ListComponent
          edit={isEdit && isEditable('additionalInfo')}
          fieldName="additionalInfo"
          value={
            publisher.additionalInfo?.length
              ? publisher.additionalInfo
              : intl.formatMessage({id: 'form.common.noAdditionalDetails'})
          }
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.createdAndUpdated" />
        </Typography>
        <ListComponent
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.created" />}
          value={publisher.created ?? ''}
        />
        <ListComponent
          fieldName="createBy"
          label={<FormattedMessage id="form.common.createdBy" />}
          value={publisher.createdBy ?? ''}
        />
        <ListComponent
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.modified" />}
          value={publisher.modified ?? ''}
        />
        <ListComponent
          fieldName="modifiedBy"
          label={<FormattedMessage id="form.common.modifiedBy" />}
          value={publisher.modifiedBy ?? ''}
        />
      </div>
    </div>
  );
}

IsbnPublisherDataComponent.propTypes = {
  publisher: PropTypes.object,
  isEdit: PropTypes.bool,
  clearFields: PropTypes.func,
  history: PropTypes.object,
  intl: PropTypes.object
};

export default IsbnPublisherDataComponent;
