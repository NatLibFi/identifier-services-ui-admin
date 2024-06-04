import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import {Typography} from '@mui/material';

import ListComponent from '/src/frontend/components/common/ListComponent.jsx';

import {deepCompareObjects} from '/src/frontend/components/utils';

function IsbnPublisherRequestDataComponent({publisherRequest, isEdit}) {
  const intl = useIntl();

  function isEditable(key) {
    const nonEditableFields = ['createdBy', 'created', 'modified', 'modifiedBy'];

    return isEdit && !nonEditableFields.includes(key);
  }

  return (
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
}

IsbnPublisherRequestDataComponent.propTypes = {
  publisherRequest: PropTypes.object.isRequired,
  isEdit: PropTypes.bool
};

export default React.memo(IsbnPublisherRequestDataComponent, deepCompareObjects);
