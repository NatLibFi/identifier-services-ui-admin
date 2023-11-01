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
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {PUBLICATION_TYPES} from '/src/frontend/components/common/form/constants';

function PublisherDetails ({publicationRequest}) {
  const intl = useIntl();

  // State for the frist Accordion element which is expanded by default
  const [expanded, setExpanded] = useState(true);

  // Handles expanding and collapsing the first Accordion element, which is expanded by default
  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div>
      {/* Julkaisun perustiedot - Publication basic information*/}
      <Accordion expanded={expanded} onChange={handleExpand}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="form.common.basicInfo" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.title" />:
            </Typography>
            <Typography>{publicationRequest?.title}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.subtitle" />:
            </Typography>
            <Typography>{publicationRequest?.subtitle ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="request.publication.publicationLanguage" />:
            </Typography>
            <Typography>
              {intl.formatMessage({
                id: `common.${publicationRequest.language?.toLowerCase()}`
              })}
            </Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.publicationMonth" />:
            </Typography>
            <Typography>{publicationRequest?.publicationMonth ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.publicationYear" />:
            </Typography>
            <Typography>{publicationRequest?.publicationYear ?? '-'}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Kustantajan tiedot - Publisher details*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="common.publisherDetails.isbnRequest" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.name" />:
            </Typography>
            <Typography>{publicationRequest?.officialName}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.publisherIdentifier" />:
            </Typography>
            <Typography>{publicationRequest?.publisherIdentifierStr ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.address" />:
            </Typography>
            <Typography>{publicationRequest?.address}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.zip" />:
            </Typography>
            <Typography>{publicationRequest?.zip}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.city" />:
            </Typography>
            <Typography>{publicationRequest?.city}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="request.publication.locality" />:
            </Typography>
            <Typography>{publicationRequest?.locality ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.phone" />:
            </Typography>
            <Typography>{publicationRequest?.phone}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.contactPerson" />:
            </Typography>
            <Typography>{publicationRequest?.contactPerson}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.email" />:
            </Typography>
            <Typography>{publicationRequest?.email}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="request.publication.contactLanguage" />:
            </Typography>
            <Typography>{intl.formatMessage({id: `common.${publicationRequest.langCode}`})}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Julkaisutoiminta - Publishing activities*/}
      {publicationRequest.publicationType !== PUBLICATION_TYPES.DISSERTATION && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <FormattedMessage id="form.common.publishingActivities" />
            </Typography>
          </AccordionSummary>
          <AccordionDetails className="savePublisherModalContainer">
            <div>
              <Typography>
                <FormattedMessage id="request.publication.publishingFrequency" />:
              </Typography>
              <Typography>{publicationRequest?.publishingActivityAmount ?? '-'}</Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="request.publication.previouslyPublished" />:
              </Typography>
              <Typography>
                {publicationRequest.publishedBefore
                  ? intl.formatMessage({id: 'common.yes'})
                  : intl.formatMessage({id: 'common.no'})}
              </Typography>
            </div>
            <div>
              <Typography>
                <FormattedMessage id="form.common.frequency" />:
              </Typography>
              <Typography>
                {publicationRequest?.publishingActivity
                  ? intl.formatMessage({
                    id: `form.isbnIsmn.publishingActivities.option.${publicationRequest.publishingActivity.toLowerCase()}`
                  })
                  : ''}
              </Typography>
            </div>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Julkaisumuoto - Format details*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="form.common.format" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.selectFormat" />:
            </Typography>
            <Typography>
              {intl.formatMessage({id: `form.isbnIsmn.format.option.${publicationRequest.publicationFormat.toLowerCase()}`})}
            </Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.printFormat" />:
            </Typography>
            <Typography>
              {publicationRequest?.type.length
                ? publicationRequest?.type.map((type) => {
                  return intl.formatMessage({
                    id: `form.printFormat.${type.toLowerCase()}`
                  });
                }).join(', ')
                : '-'}
            </Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publisherRegistry.publisher.typeOther" />:
            </Typography>
            <Typography>{publicationRequest?.typeOther ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publisherRegistry.publisher.manufacturer" />:
            </Typography>
            <Typography>{publicationRequest?.printingHouse ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.city" />:
            </Typography>
            <Typography>{publicationRequest?.printingHouseCity ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publisherRegistry.publisher.run" />:
            </Typography>
            <Typography>{publicationRequest?.copies ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publisherRegistry.publisher.edition" />:
            </Typography>
            <Typography>{publicationRequest?.edition ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.fileFormat" />:
            </Typography>
            <Typography>
              {publicationRequest?.fileformat.length ?
                publicationRequest?.fileformat.map((fileformat) => {
                  return intl.formatMessage({
                    id: `form.fileFormat.${fileformat.toLowerCase()}`
                  });
                }).join(', ')
                : '-'}
            </Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publisherRegistry.publisher.fileFormatOther" />:
            </Typography>
            <Typography>{publicationRequest?.fileformatOther ?? '-'}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Tekijät - Authors*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="request.publication.authors" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer authors">
          {['1','2','3','4'].map((digit) => {
            return (
              <div key={digit}>
                <Typography>
                  <FormattedMessage id="common.author" values={{digit}} />:
                </Typography>
                <section>
                  <Typography><FormattedMessage id="request.publication.givenName" />:</Typography>
                  <Typography>{publicationRequest?.[`firstName${digit}`] ?? '-'}</Typography>
                </section>
                <section>
                  <Typography><FormattedMessage id="request.publication.familyName" />:</Typography>
                  <Typography>{publicationRequest?.[`lastName${digit}`] ?? '-'}</Typography>
                </section>
                <section>
                  <Typography><FormattedMessage id="form.isbnIsmn.authors.card.roles" /></Typography>
                  <Typography>
                    {
                      publicationRequest?.[`role${digit}`].map((role) => {
                        return intl.formatMessage({
                          id: `form.isbnIsmn.authors.role.option.${role.toLowerCase()}`
                        });
                      }).join(', ')
                          ?? '-'
                    }
                  </Typography>
                </section>
              </div>
            );
          }
          )}
        </AccordionDetails>
      </Accordion>

      {/* Sarjan tiedot - Series details*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="request.publication.seriesDetails" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.volume" />:
            </Typography>
            <Typography>{publicationRequest?.volume ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.title" />:
            </Typography>
            <Typography>{publicationRequest?.series ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.identifier" />:
            </Typography>
            <Typography>{publicationRequest?.issn ?? '-'}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Muut tiedot - Other details*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="form.common.otherInfo" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.createdBy" />:
            </Typography>
            <Typography>{publicationRequest?.createdBy}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.created" />:
            </Typography>
            <Typography>{moment(publicationRequest?.created).format('LLL')}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.modifiedBy" />:
            </Typography>
            <Typography>{publicationRequest?.modifiedBy ?? '-'}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.modified" />:
            </Typography>
            <Typography>{moment(publicationRequest?.modified).format('LLL') ?? '-'}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Julkaisun lisätiedot - Publication additional details*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="common.publicationDetails" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="request.publication.isPublic" />:
            </Typography>
            <Typography>{intl.formatMessage({id: `common.${publicationRequest.publicationsPublic}`})}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="request.publication.publicationsIntra" />:
            </Typography>
            <Typography>{intl.formatMessage({id: `common.${publicationRequest.publicationsIntra}`})}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.format" />:
            </Typography>
            <Typography>{intl.formatMessage({id: `common.${publicationRequest.publicationType}`})}</Typography>
          </div>
          {publicationRequest.publicationType === PUBLICATION_TYPES.MAP && (
            <div>
              <Typography>
                <FormattedMessage id="form.common.scale" />:
              </Typography>
              <Typography>{publicationRequest?.mapScale ?? '-'}</Typography>
            </div>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Lisätiedot - Additional details*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="form.common.additionalDetails" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.additionalDetails" />:
            </Typography>
            <Typography>{publicationRequest?.comments ?? '-'}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>

      {/* Hakulomakkeen ylläpito - Form management*/}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>
            <FormattedMessage id="request.publication.administration" />
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="savePublisherModalContainer">
          <div>
            <Typography>
              <FormattedMessage id="request.publication.noIdentifierGranted" />:
            </Typography>
            <Typography>{intl.formatMessage({id: `common.${publicationRequest.noIdentifierGranted}`})}</Typography>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="request.publication.onProcess" />:
            </Typography>
            <Typography>{intl.formatMessage({id: `common.${publicationRequest.onProcess}`})}</Typography>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

PublisherDetails.propTypes = {
  publicationRequest: PropTypes.object.isRequired
};

export default PublisherDetails;
