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

import React, {useState} from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';

import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  List
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {makeApiRequest} from '/src/frontend/actions';

import {classificationCodes} from '/src/frontend/components/common/form/constants';
import {getIdentifiersAvailable} from '/src/frontend/rangeFormattingUtils';

function PublisherDetails (props) {
  const {
    publisher,
    publisherId,
    publicationRequest,
    setPublicationRequest,
    setSnackbarMessage,
    authenticationToken,
    setSavePublisherModalOpen,
    handleCloseSavePublisherModal
  } = props;

  const intl = useIntl();

  // State for the frist Accordion element which is expanded by default
  const [expanded, setExpanded] = useState(true);

  // Handles expanding and collapsing the first Accordion element, which is expanded by default
  const handleExpand = () => {
    setExpanded(!expanded);
  };

  // Handles saving of a publisher
  async function handleSavePublisher() {
    const requestBody = {publisherId};

    const updatePublicationRequest = await makeApiRequest({
      url: `/api/isbn-registry/requests/publications/${publicationRequest.id}/set-publisher`,
      method: 'PUT',
      values: requestBody,
      authenticationToken,
      setSnackbarMessage
    });

    if (updatePublicationRequest) {
      setPublicationRequest(updatePublicationRequest);
    }
    setSavePublisherModalOpen(false);
  }

  return (
    <>
      <div>
        {/* Kustantajan perustiedot - Publisher basic information */}
        <Accordion expanded={expanded} onChange={handleExpand}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="form.common.basicInfo" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="form.common.name" />:
              </Typography>
              <Typography>{publisher?.officialName}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.phone" />:
              </Typography>
              <Typography>{publisher?.phone}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.language" />:
              </Typography>
              <Typography>
                <FormattedMessage id={`common.${publisher?.langCode}`} />
              </Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.email" />:
              </Typography>
              <Typography>{publisher?.email ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.contactPerson" />:
              </Typography>
              <Typography>{publisher?.contactPerson ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.website" />:
              </Typography>
              <Typography>{publisher?.www ?? '-'}</Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Kustantajan osoitetiedot - Publisher address information */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="form.common.postalAddress" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="form.common.address" />:
              </Typography>
              <Typography>{publisher?.address}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.addressLine1" />:
              </Typography>
              <Typography>{publisher?.addressLine1 ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.zip" />:
              </Typography>
              <Typography>{publisher?.zip}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.city" />:
              </Typography>
              <Typography>{publisher?.city}</Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Kustantajatunnukset - Publisher identifiers */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="form.common.publisherIdentifiers" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <List>
              {publisher?.isbnSubRanges && publisher?.isbnSubRanges.length > 0 && (
                <div>
                  <Typography>ISBN: </Typography>
                  <ul>
                    {publisher?.isbnSubRanges?.map((isbnSubRange) => {
                      if (isbnSubRange.publisherIdentifier === publisher.activeIdentifierIsbn) {
                        return (
                          <li key={isbnSubRange.publisherIdentifier}>
                            <strong>
                              {isbnSubRange.publisherIdentifier} (
                              {getIdentifiersAvailable(isbnSubRange)}{' '}
                              {intl.formatMessage({id: 'ranges.range.free'})},{' '}
                              {intl.formatMessage({id: 'ranges.range.isActive'})})
                            </strong>
                          </li>
                        );
                      }
                      return (
                        <li key={isbnSubRange.publisherIdentifier}>
                          {isbnSubRange.publisherIdentifier} (
                          {getIdentifiersAvailable(isbnSubRange)}{' '}
                          {intl.formatMessage({id: 'ranges.range.free'})})
                        </li>
                      );
                    }) ?? '-'}
                  </ul>
                </div>
              )}

              {publisher?.ismnSubRanges && publisher?.ismnSubRanges.length > 0 && (
                <div>
                  <Typography>ISMN: </Typography>
                  <ul>
                    {publisher?.ismnSubRanges?.map((ismnSubRange) => {
                      if (ismnSubRange.publisherIdentifier === publisher.activeIdentifierIsmn) {
                        return (
                          <li key={ismnSubRange.publisherIdentifier}>
                            <strong>
                              {ismnSubRange.publisherIdentifier} (
                              {getIdentifiersAvailable(ismnSubRange)}{' '}
                              {intl.formatMessage({id: 'ranges.range.free'})},{' '}
                              {intl.formatMessage({id: 'ranges.range.isActive'})})
                            </strong>
                          </li>
                        );
                      }
                      return (
                        <li key={ismnSubRange.publisherIdentifier}>
                          {ismnSubRange.publisherIdentifier} (
                          {getIdentifiersAvailable(ismnSubRange)}{' '}
                          {intl.formatMessage({id: 'ranges.range.free'})})
                        </li>
                      );
                    }) ?? '-'}
                  </ul>
                </div>
              )}
            </List>
          </AccordionDetails>
        </Accordion>

        {/* Organisaation lisätiedot - Organization information */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="form.common.organizationDetails" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="form.common.affiliates" />:
              </Typography>
              <Typography>{publisher?.affiliates ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.affiliateOf" />:
              </Typography>
              <Typography>{publisher?.affiliateOf ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.distributors" />:
              </Typography>
              <Typography>{publisher?.distributors ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.distributorOf" />:
              </Typography>
              <Typography>{publisher?.distributorOf ?? '-'}</Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Muut ja aikaisemmat nimet - Other and previous names */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="modal.savePublisher.otherAndPreviousNames" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="modal.savePublisher.otherNameForms" />:
              </Typography>
              <Typography>{publisher?.otherNames ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.previousNames" />:
              </Typography>
              <Typography>
                {publisher?.previousNames?.map((name) => name).join(', ') ?? '-'}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Kustannusaktiiivisuus ja luokitus - Publishing activity and classification */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="modal.savePublisher.frequencyAndClassification" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="modal.savePublisher.currentYear" />:
              </Typography>
              <Typography>{publisher?.frequencyCurrent ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="modal.savePublisher.nextYear" />:
              </Typography>
              <Typography>{publisher?.frequencyNext ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.classification" />:
              </Typography>
              <Typography>
                {publisher?.classification
                  ?.map((item) =>
                    intl.formatMessage({
                      id: classificationCodes.find((code) => code.value === item)?.label
                    })
                  )
                  .join(', ') ?? '-'}
              </Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.classificationOther" />:
              </Typography>
              <Typography>{publisher?.classificationOther ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="modal.savePublisher.publisherHasQuitted" />:
              </Typography>
              <Typography>
                <FormattedMessage id={publisher?.hasQuitted ? 'common.yes' : 'common.no'} />
              </Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="modal.savePublisher.yearInactivated" />:
              </Typography>
              <Typography>
                {publisher?.yearQuitted === '' ? '-' : publisher?.yearQuitted}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Muut tiedot - Other information */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="form.common.otherInfo" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="form.common.created" />:
              </Typography>
              <Typography>
                {publisher?.created === undefined ? '-' : moment(publisher.created).format('LLL')}
              </Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.createdBy" />:
              </Typography>
              <Typography>{publisher?.createdBy}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.modified" />:
              </Typography>
              <Typography>
                {publisher?.modified === undefined
                  ? '-'
                  : moment(publisher?.modified).format('LLL')}
              </Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.modifiedBy" />:
              </Typography>
              <Typography>{publisher?.modifiedBy}</Typography>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Lisätiedot - Additional information */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
          >
            <Typography>
              <FormattedMessage id="form.common.additionalDetails" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="form.common.additionalDetails" />:
              </Typography>
              <Typography>
                {publisher?.additionalInfo === '' ? '-' : publisher?.additionalInfo}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="createListInnerContainer">
        <Button variant="contained" color="success" onClick={handleSavePublisher}>
          <FormattedMessage id="form.button.label.approve" />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCloseSavePublisherModal}
        >
          <FormattedMessage id="form.button.label.reject" />
        </Button>
      </div>
    </>
  );
}

PublisherDetails.propTypes = {
  publisher: PropTypes.object.isRequired,
  publisherId: PropTypes.number.isRequired,
  publicationRequest: PropTypes.object.isRequired,
  setPublicationRequest: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  authenticationToken: PropTypes.string.isRequired,
  setSavePublisherModalOpen: PropTypes.func.isRequired,
  handleCloseSavePublisherModal: PropTypes.func.isRequired
};

export default PublisherDetails;
