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
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';
import moment from 'moment';

import {
  Button,
  Typography,
  Modal,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import {classificationCodes} from '/src/frontend/components/common/form/constants';
import {getIdentifiersAvailable} from '/src/frontend/rangeFormattingUtils';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function SavePublisherModal(props) {
  const {
    publisherId,
    publicationRequestId,
    setPublicationRequest,
    authenticationToken,
    savePublisherModalOpen,
    setSavePublisherModalOpen,
    setSnackbarMessage,
    handleCloseSavePublisherModal
  } = props;

  const intl = useIntl();

  // State for the first Accordion element which is expanded by default
  const [expanded, setExpanded] = useState(true);

  // Fetching data of the current request
  const {data, loading, error} = useItem({
    url: `/api/isbn-registry/publishers/${publisherId}`,
    method: 'GET',
    authenticationToken,
    dependencies: [savePublisherModalOpen],
    prefetch: false,
    fetchOnce: false,
    requireAuth: true,
    modalIsUsed: true,
    isModalOpen: savePublisherModalOpen
  });

  /* Handles saving of a publisher */
  async function handleSavePublisher() {
    const requestBody = {publisherId};

    const updatePublicationRequest = await makeApiRequest({
      url: `/api/isbn-registry/requests/publications/${publicationRequestId}/set-publisher`,
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

  // Handles expanding and collapsing the first Accordion element, which is expanded by default
  const handleExpandFirstAccordion = () => {
    setExpanded(!expanded);
  };

  const component = getComponent();

  function getComponent() {
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

    if (Object.keys(data).length === 0) {
      return (
        <div>
          <Typography>
            <FormattedMessage id="modal.savePublisher.noData" />
          </Typography>
        </div>
      );
    }

    return (
      <>
        <div>
          <Accordion expanded={expanded} onChange={handleExpandFirstAccordion}>
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
                  <FormattedMessage id="form.common.name" />:{' '}
                </Typography>
                <Typography>{data?.officialName}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.phone" />:
                </Typography>{' '}
                <Typography>{data?.phone}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.language" />:
                </Typography>{' '}
                <Typography>
                  <FormattedMessage id={`common.${data?.langCode}`} />
                </Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.email" />:{' '}
                </Typography>
                <Typography>{data?.email ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.contactPerson" />:{' '}
                </Typography>
                <Typography>{data?.contactPerson ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.website" />:{' '}
                </Typography>
                <Typography>{data?.www ?? '-'}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
                  <FormattedMessage id="form.common.address" />:{' '}
                </Typography>
                <Typography>{data?.address}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.addressLine1" />:{' '}
                </Typography>
                <Typography>{data?.addressLine1 ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.zip" />:{' '}
                </Typography>
                <Typography>{data?.zip}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.city" />:{' '}
                </Typography>
                <Typography>{data?.city}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
                {data?.isbnSubRanges && data?.isbnSubRanges.length > 0 && (
                  <div>
                    <Typography>ISBN: </Typography>
                    <ul>
                      {data?.isbnSubRanges?.map((isbnSubRange) => {
                        if (isbnSubRange.publisherIdentifier === data.activeIdentifierIsbn) {
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

                {data?.ismnSubRanges && data?.ismnSubRanges.length > 0 && (
                  <div>
                    <Typography>ISMN: </Typography>
                    <ul>
                      {data?.ismnSubRanges?.map((ismnSubRange) => {
                        if (ismnSubRange.publisherIdentifier === data.activeIdentifierIsmn) {
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
                  <FormattedMessage id="form.common.affiliates" />:{' '}
                </Typography>
                <Typography>{data?.affiliates ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.affiliateOf" />:{' '}
                </Typography>
                <Typography>{data?.affiliateOf ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.distributors" />:{' '}
                </Typography>
                <Typography>{data?.distributors ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.distributorOf" />:{' '}
                </Typography>
                <Typography>{data?.distributorOf ?? '-'}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
                  <FormattedMessage id="modal.savePublisher.otherNameForms" />:{' '}
                </Typography>
                <Typography>{data?.otherNames ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.previousNames" />:{' '}
                </Typography>
                <Typography>
                  {data?.previousNames?.map((name) => name).join(', ') ?? '-'}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
                  <FormattedMessage id="modal.savePublisher.currentYear" />:{' '}
                </Typography>
                <Typography>{data?.frequencyCurrent ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="modal.savePublisher.nextYear" />:{' '}
                </Typography>
                <Typography>{data?.frequencyNext ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.classification" />:{' '}
                </Typography>
                <Typography>
                  {data?.classification
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
                  <FormattedMessage id="form.common.classificationOther" />:{' '}
                </Typography>
                <Typography>{data?.classificationOther ?? '-'}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="modal.savePublisher.publisherHasQuitted" />:{' '}
                </Typography>
                <Typography>
                  <FormattedMessage id={data?.hasQuitted ? 'common.yes' : 'common.no'} />
                </Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="modal.savePublisher.yearInactivated" />:{' '}
                </Typography>
                <Typography>
                  {data?.yearQuitted === '' ? '-' : data?.yearQuitted}
                </Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
                  {' '}
                  <FormattedMessage id="form.common.created" />:{' '}
                </Typography>
                <Typography>
                  {data?.created === undefined ? '-' : moment(data.created).format('LLL')}
                </Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.createdBy" />:{' '}
                </Typography>
                <Typography>{data?.createdBy}</Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.modified" />:{' '}
                </Typography>
                <Typography>
                  {data?.modified === undefined
                    ? '-'
                    : moment(data?.modified).format('LLL')}
                </Typography>
              </div>
              <div>
                <Typography>
                  <FormattedMessage id="form.common.modifiedBy" />:{' '}
                </Typography>
                <Typography>{data?.modifiedBy}</Typography>
              </div>
            </AccordionDetails>
          </Accordion>
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
                  {' '}
                  <FormattedMessage id="form.common.additionalDetails" />:{' '}
                </Typography>
                <Typography>
                  {data?.additionalInfo === '' ? '-' : data?.additionalInfo}
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

  return (
    <Modal open={savePublisherModalOpen} onClose={handleCloseSavePublisherModal}>
      <Box className="createListModal savePublisherModal">
        <Typography variant="h4">
          <FormattedMessage id="modal.savePublisher" />
        </Typography>
        {component}
      </Box>
    </Modal>
  );
}

SavePublisherModal.propTypes = {
  setPublicationRequest: PropTypes.func.isRequired,
  savePublisherModalOpen: PropTypes.bool.isRequired,
  setSavePublisherModalOpen: PropTypes.func.isRequired,
  handleCloseSavePublisherModal: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  publisherId: PropTypes.number,
  publicationRequestId: PropTypes.number.isRequired,
  authenticationToken: PropTypes.string.isRequired
};

export default SavePublisherModal;
