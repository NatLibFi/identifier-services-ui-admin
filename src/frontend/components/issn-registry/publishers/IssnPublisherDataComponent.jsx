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
import '/src/frontend/css/publishers.css';

import {containsInformation} from '/src/frontend/components/issn-registry/apiFormatUtils';
import ListComponent from '/src/frontend/components/common/ListComponent.jsx';
import {deepCompareObjects} from '/src/frontend/components/utils';

function IssnPublisherDataComponent(props) {
  const {publisher, isEdit} = props;
  const intl = useIntl();

  function isEditable(key) {
    const nonEditableFields = ['id', 'formId', 'idOld'];

    return isEdit && !nonEditableFields.includes(key);
  }

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
          <FormattedMessage id="form.common.basicInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('id')}
          fieldName="id"
          label={<FormattedMessage id="common.id" />}
          value={publisher.id ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('officialName')}
          fieldName="officialName"
          label={<FormattedMessage id="common.publisher.issn" />}
          value={publisher.officialName ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('langCode')}
          fieldName="langCode"
          label={<FormattedMessage id="form.common.language" />}
          value={intl.formatMessage({id: `common.${publisher.langCode}`}) ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="publisher.issn.contactPerson" />
        </Typography>
        <ListComponent
          edit={false} // Never edit through edit mode
          fieldName="contactPerson"
          value={
            isValidArrayAttribute(publisher.contactPerson)
              ? publisher.contactPerson
              : intl.formatMessage({id: 'common.undefined'})
          }
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="common.contactDetails" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('emailCommon')}
          fieldName="emailCommon"
          label={<FormattedMessage id="form.common.email" />}
          value={publisher.emailCommon ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('phone')}
          fieldName="phone"
          label={<FormattedMessage id="form.common.phone" />}
          value={publisher.phone ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('address')}
          fieldName="address"
          label={<FormattedMessage id="form.common.address" />}
          value={publisher.address ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('zip')}
          fieldName="zip"
          label={<FormattedMessage id="form.common.zip" />}
          value={publisher.zip ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('city')}
          fieldName="city"
          label={<FormattedMessage id="form.common.city" />}
          value={publisher.city ?? ''}
        />
      </div>
      <div className="listComponentContainer">
        <Typography variant="h6" className="listComponentContainerHeader">
          <FormattedMessage id="form.common.otherInfo" />
        </Typography>
        <ListComponent
          edit={isEdit && isEditable('formId')}
          fieldName="formId"
          label={<FormattedMessage id="publisher.issn.formId" />}
          // Publishers created via quick form do not have a formId
          linkPath={
            publisher.formId === 0 ? '' : `/issn-registry/requests/${publisher.formId}`
          }
          value={publisher.formId === 0 ? '' : 'link'}
        />
        <ListComponent
          edit={isEdit && isEditable('idOld')}
          fieldName="idOld"
          label={<FormattedMessage id="publisher.issn.oldId" />}
          // 0 evaluates to false -> "-", otherwise displaying integer value
          value={publisher.idOld ?? ''}
        />
        <ListComponent
          edit={isEdit && isEditable('additionalInfo')}
          fieldName="additionalInfo"
          placeholder={intl.formatMessage({id: 'form.common.additionalDetails'})}
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
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.created" />}
          value={publisher.created ?? ''}
        />
        <ListComponent
          edit={false}
          fieldName="createBy"
          label={<FormattedMessage id="form.common.createdBy" />}
          value={publisher.createdBy ?? ''}
        />
        <ListComponent
          edit={false}
          fieldName="timestamp"
          label={<FormattedMessage id="form.common.modified" />}
          value={publisher.modified ?? ''}
        />
        <ListComponent
          edit={false}
          fieldName="modifiedBy"
          label={<FormattedMessage id="form.common.modifiedBy" />}
          value={publisher.modifiedBy ?? ''}
        />
      </div>
    </div>
  );
}

IssnPublisherDataComponent.propTypes = {
  isEdit: PropTypes.bool.isRequired,
  publisher: PropTypes.object.isRequired
};

export default React.memo(IssnPublisherDataComponent, deepCompareObjects);
