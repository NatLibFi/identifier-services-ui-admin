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
import {FormattedMessage, useIntl} from 'react-intl';
import {Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/dataComponent.css';

import {containsInformation} from '/src/frontend/components/issn-registry/apiFormatUtils';

import ListComponent from '/src/frontend/components/common/ListComponent.jsx';
import IssnLinkedPublicationEditModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnLinkedPublicationEditModal.jsx';

import {deepCompareObjects} from '/src/frontend/components/utils';

function IssnPublicationDataComponent(props) {
  const {issnPublication, isEdit, updatePublication} = props;
  const intl = useIntl();

  /* Set non-editable fields */
  const isEditable = (key) => {
    const nonEditableFields = ['id', 'issn', 'publisher'];

    if (!isEdit) return false;

    return !nonEditableFields.includes(key);
  };

  const isValidArrayAttribute = (value) => {
    if (!value || !Array.isArray(value)) {
      return false;
    }

    return value.filter(containsInformation).length > 0;
  };

  return (
    <div className="mainContainer">
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="common.publicationDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('id')}
          fieldName="id"
          label={<FormattedMessage id="common.id" />}
          value={issnPublication.id}
        />
        <ListComponent
          edit={isEdit && isEditable('title')}
          fieldName="title"
          label={<FormattedMessage id="form.common.title" />}
          value={issnPublication.title}
        />
        <ListComponent
          edit={isEdit && isEditable('subtitle')}
          fieldName="subtitle"
          label={<FormattedMessage id="form.common.subtitle" />}
          value={issnPublication.subtitle}
        />
        <ListComponent
          edit={isEdit && isEditable('issn')}
          fieldName="issn"
          label={<FormattedMessage id="common.issn" />}
          value={issnPublication.issn}
        />
        <ListComponent
          edit={isEdit && isEditable('language')}
          fieldName="language"
          label={<FormattedMessage id="form.common.language" />}
          value={intl.formatMessage({
            id: `common.${issnPublication.language?.toLowerCase()}`
          })}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="publication.issn.additionalDetails" />
        </Typography>
        {issnPublication.publisherId && issnPublication.publisher.officialName ? (
          <ListComponent
            linkPath={`/issn-registry/publishers/${issnPublication.publisherId}`}
            edit={isEdit && isEditable('publisher')}
            fieldName="publisher"
            label={<FormattedMessage id="common.publisher.issn" />}
            value={issnPublication.publisher.officialName}
          />
        ) : (
          <ListComponent
            edit={isEdit && isEditable('publisher')}
            fieldName="publisher"
            label={<FormattedMessage id="common.publisher.issn" />}
            value={'Ei määritetty'}
          />
        )}
        <ListComponent
          linkPath={`/issn-registry/requests/${issnPublication.formId}`}
          edit={isEdit && isEditable('request')}
          fieldName="request"
          label={<FormattedMessage id="common.request" />}
          value={'link'}
        />
        <ListComponent
          edit={isEdit && isEditable('issnPublicationStatus')}
          fieldName="issnPublicationStatus"
          label={<FormattedMessage id="common.status" />}
          value={intl.formatMessage({
            id: `common.${issnPublication.status?.toLowerCase()}`
          })}
        />
        <ListComponent
          edit={isEdit && isEditable('placeOfPublication')}
          fieldName="placeOfPublication"
          label={<FormattedMessage id="form.common.publicationCity" />}
          value={issnPublication.placeOfPublication}
        />
        <ListComponent
          edit={isEdit && isEditable('printer')}
          fieldName="printer"
          label={<FormattedMessage id="publication.issn.manufacturer" />}
          value={issnPublication.printer}
        />
        <ListComponent
          edit={isEdit && isEditable('url')}
          fieldName="url"
          label={<FormattedMessage id="form.common.website" />}
          value={issnPublication.url}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.publishingActivities" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('issuedFromYear')}
          fieldName="issuedFromYear"
          label={<FormattedMessage id="publication.issn.firstYear" />}
          value={issnPublication.issuedFromYear ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('issuedFromNumber')}
          fieldName="issuedFromNumber"
          label={<FormattedMessage id="publication.issn.issued_from_number" />}
          value={issnPublication.issuedFromNumber ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('frequency')}
          fieldName="frequency"
          label={<FormattedMessage id="publication.issn.frequency" />}
          value={
            issnPublication.frequency
              ? intl.formatMessage({id: `common.${issnPublication.frequency}`})
              : ''
          }
        />
        <ListComponent
          edit={isEdit && isEditable('frequencyOther')}
          fieldName="frequencyOther"
          label={<FormattedMessage id="publication.issn.other" />}
          value={issnPublication.frequencyOther ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.format" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('publicationTypeIssn')}
          fieldName="publicationTypeIssn"
          label={<FormattedMessage id="publication.issn.type" />}
          value={
            issnPublication.publicationType
              ? intl.formatMessage({
                id: `common.${issnPublication.publicationType?.toLowerCase()}`
              })
              : ''
          }
        />
        <ListComponent
          edit={isEdit && isEditable('publicationTypeOther')}
          fieldName="publicationTypeOther"
          label={<FormattedMessage id="publication.issn.other" />}
          value={issnPublication.publicationTypeOther ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('medium')}
          fieldName="medium"
          label={<FormattedMessage id="form.common.format" />}
          value={
            issnPublication.medium
              ? intl.formatMessage({
                id: `form.issn.publicationMedium.${issnPublication.medium?.toLowerCase()}`
              })
              : ''
          }
        />
        <ListComponent
          edit={isEdit && isEditable('mediumOther')}
          fieldName="mediumOther"
          label={<FormattedMessage id="publication.issn.other" />}
          value={issnPublication.mediumOther ?? ''}
        />
      </div>

      <div className="listComponentContainer">
        <IssnLinkedPublicationEditModal
          initialState={issnPublication}
          attribute={'previous'}
          edit={!isEdit}
          headerIntlId={'publication.issn.previousNameForms'}
          updatePublication={updatePublication}
        />

        <ListComponent
          edit={false} // Never edit through edit mode
          fieldName="issn_previous"
          value={
            isValidArrayAttribute(issnPublication.previous)
              ? issnPublication.previous
              : intl.formatMessage({id: 'common.undefined'})
          }
        />
      </div>

      <div className="listComponentContainer">
        <IssnLinkedPublicationEditModal
          initialState={issnPublication}
          attribute={'mainSeries'}
          edit={!isEdit}
          headerIntlId={'publication.issn.mainSeries.admin'}
          updatePublication={updatePublication}
        />

        <ListComponent
          edit={false} // Never edit through edit mode
          fieldName="issn_main_series"
          value={
            isValidArrayAttribute(issnPublication.mainSeries)
              ? issnPublication.mainSeries
              : intl.formatMessage({id: 'common.undefined'})
          }
        />
      </div>

      <div className="listComponentContainer">
        <IssnLinkedPublicationEditModal
          initialState={issnPublication}
          attribute={'subseries'}
          edit={!isEdit}
          headerIntlId={'publication.issn.subSeries.admin'}
          updatePublication={updatePublication}
        />

        <ListComponent
          edit={false} // Never edit through edit mode
          fieldName="issn_subseries"
          value={
            isValidArrayAttribute(issnPublication.subseries)
              ? issnPublication.subseries
              : intl.formatMessage({id: 'common.undefined'})
          }
        />
      </div>

      <div className="listComponentContainer">
        <IssnLinkedPublicationEditModal
          initialState={issnPublication}
          attribute={'anotherMedium'}
          edit={!isEdit}
          headerIntlId={'publication.issn.anotherMedium.admin'}
          updatePublication={updatePublication}
        />

        <ListComponent
          edit={false} // Never edit through edit mode
          fieldName="issn_another_medium"
          value={
            isValidArrayAttribute(issnPublication.anotherMedium)
              ? issnPublication.anotherMedium
              : intl.formatMessage({id: 'common.undefined'})
          }
        />
      </div>

      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.additionalDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('additionalInfo')}
          fieldName="additionalInfo"
          placeholder={intl.formatMessage({id: 'form.common.additionalDetails'})}
          value={
            issnPublication.additionalInfo?.length
              ? issnPublication.additionalInfo
              : intl.formatMessage({id: 'form.common.noAdditionalDetails'})
          }
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.otherInfo" />
        </Typography>
        <ListComponent
          edit={false}
          label={<FormattedMessage id="form.common.createdBy" />}
          value={issnPublication.createdBy}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.created" />}
          value={issnPublication.created}
        />
        <ListComponent
          edit={false}
          label={<FormattedMessage id="form.common.modifiedBy" />}
          value={issnPublication.modifiedBy}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.modified" />}
          value={issnPublication.modified}
        />
      </div>
    </div>
  );
}

IssnPublicationDataComponent.propTypes = {
  issnPublication: PropTypes.object.isRequired,
  isEdit: PropTypes.bool.isRequired,
  updatePublication: PropTypes.func.isRequired
};

export default React.memo(IssnPublicationDataComponent, deepCompareObjects);
