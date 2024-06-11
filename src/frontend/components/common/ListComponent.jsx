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
import {Field} from 'react-final-form';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import {PropTypes, oneOfType} from 'prop-types';

import {Grid, ListItemText, Link} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';

import RenderEditRejectIdentifier from './form/render/RenderEditRejectIdentifier.jsx';
import RenderClassification from './form/render/RenderClassification.jsx';
import RenderEditAdditionalDetails from './form/render/RenderEditAdditionalDetails.jsx';
import RenderEditSelect from './form/render/RenderEditSelect.jsx';
import RenderEditPublicationMonth from './form/render/RenderEditPublicationMonth.jsx';
import RenderEditPublicationYear from './form/render/RenderEditPublicationYear.jsx';
import RenderIsbnIds from './form/render/RenderIsbnIds.jsx';
import RenderArray from './form/render/RenderArray.jsx';
import RenderTextField from './form/render/RenderTextField.jsx';
import {
  langCodeOptions,
  publicationFormatOptions,
  publicationTypeOptions,
  mediumOptions,
  issnPublicationTypeOptions,
  issnPublicationFrequencyOptions,
  issnPublicationRequestStatusOptions,
  issnPublicationStatusOptions,
  publisherPublishingActivityOptions,
  booleanOptions,
  publishingLanguages
} from '/src/frontend/components/common/form/constants';
import '/src/frontend/css/listComponent.css';

function ListComponent(props) {
  const {
    label,
    value,
    edit,
    linkPath,
    fieldName,
    cancelId,
    removeId,
    placeholder,
    format
  } = props;
  /* Renders component based on value type and fieldName */
  function getRender() {
    /* Rendering Array type of values is handled separately at current stage */
    if (Array.isArray(value)) {
      return <RenderArray value={value} fieldName={fieldName} edit={edit} label={label} />;
    }
    /* Render of string, number and boolean values is defined through isEdit and fieldName parameters */
    /* For fields containing link, a separate render is defined */
    return (
      <>
        {label && (
          <Grid item xs={6}>
            <span className="label">{label}:</span>
          </Grid>
        )}
        <Grid item xs={6}>
          {!linkPath && getValue()}
          {linkPath && getLink()}
        </Grid>
      </>
    );
    /* Rendering of non-object values is defined here. Different render may be used for edit mode. */
    function getValue() {
      if (edit) {
        return editValue();
      }
      return nonEditValue();
      function editValue() {
        if (fieldName === 'comments' || fieldName === 'additionalInfo' || fieldName === 'additional_info') {
          return <RenderEditAdditionalDetails fieldName={fieldName} label={label} placeholder={placeholder} />;
        }
        if (fieldName === 'language') {
          return <RenderEditSelect fieldName={fieldName} options={publishingLanguages} />;
        }
        if (fieldName === 'langCode' || fieldName === 'lang_code') {
          return <RenderEditSelect fieldName={fieldName} options={langCodeOptions} />;
        }
        if ([
          'hasQuitted',
          'onProcess',
          'publicationsPublic',
          'publicationsIntra',
          'publishedBefore',
          'promoteSorting'
        ].includes(fieldName)) {
          return <RenderEditSelect fieldName={fieldName} options={booleanOptions} />;
        }
        if (fieldName === 'publicationFormat') {
          return <RenderEditSelect fieldName={fieldName} options={publicationFormatOptions} />;
        }
        if (fieldName === 'publicationType') {
          return <RenderEditSelect fieldName={fieldName} options={publicationTypeOptions} />;
        }
        if (fieldName === 'publicationTypeIssn') {
          return <RenderEditSelect fieldName='publicationType' options={issnPublicationTypeOptions} />;
        }
        if (fieldName === 'medium') {
          return <RenderEditSelect fieldName={fieldName} options={mediumOptions} />;
        }
        if (fieldName === 'publishingActivity') {
          return <RenderEditSelect fieldName={fieldName} options={publisherPublishingActivityOptions} />;
        }
        if (fieldName === 'frequency') {
          return <RenderEditSelect fieldName={fieldName} options={issnPublicationFrequencyOptions} />;
        }
        if (fieldName === 'publicationMonth') {
          return <RenderEditPublicationMonth value={value} />;
        }
        if (fieldName === 'publicationYear') {
          return <RenderEditPublicationYear value={value} />;
        }
        if (fieldName === 'noIdentifierGranted') {
          return <RenderEditRejectIdentifier fieldName={fieldName} />;
        }
        if (fieldName === 'issnPublicationRequestStatus') {
          return <RenderEditSelect fieldName='status' options={issnPublicationRequestStatusOptions} />;
        }
        if (fieldName === 'issnPublicationStatus') {
          return <RenderEditSelect fieldName='status' options={issnPublicationStatusOptions} />;
        }
        // Note, parse is used for overriding react-final-form default behaviour of converting empty strings to undefined
        // See https://final-form.org/docs/react-final-form/types/FieldProps#parse
        return (
          <Field
            parse={(v) => v}
            name={fieldName}
            className="editForm"
            component={(props) => <RenderTextField {...props} />}
          />
        );
      }
      function nonEditValue() {
        if (fieldName === 'classification') {
          return <RenderClassification value={value} />;
        }
        if (fieldName === 'publicationIdentifierElectronical' || fieldName === 'publicationIdentifierPrint') {
          return <RenderIsbnIds value={value} cancelId={cancelId} removeId={removeId} format={format} />;
        }
        if (fieldName === 'timestamp') {
          return moment(value).isValid() ? moment(value).format('LLL') : value;
        }
        if (fieldName === 'canceledCount' || fieldName === 'deletedCount') {
          return value;
        }
        if (fieldName === 'comments' || fieldName === 'additionalInfo' || fieldName === 'additional_info') {
          // <pre> wrapper is used to preserve line breaks
          return <pre className="comments">{value}</pre>;
        }
        return value ? value : <FormattedMessage id="common.noValue" />;
      }
    }
    function getLink() {
      if (value) {
        return (
          <Link
            href={linkPath}
            className="createdResourceLink"
            target="_blank"
            rel="noreferrer"
          >
            {value === 'link' ? <FormattedMessage id="common.link" /> : value}
            <LinkIcon />
          </Link>
        );
      }
      return <FormattedMessage id="common.noLink" />;
    }
  }
  return (
    <div>
      <ListItemText>
        <Grid container>{getRender()}</Grid>
      </ListItemText>
    </div>
  );
}
ListComponent.propTypes = {
  label: oneOfType([PropTypes.string, PropTypes.object]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array
  ]),
  edit: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  linkPath: PropTypes.string,
  fieldName: PropTypes.string,
  cancelId: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  removeId: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  placeholder: PropTypes.string,
  format: PropTypes.string
};
export default ListComponent;
