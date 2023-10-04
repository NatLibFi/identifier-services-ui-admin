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
import PropTypes from 'prop-types';
import {Accordion, AccordionSummary, AccordionDetails, Modal, Box, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

function MelindaResponseModal({apiResponse, closeMelindaResponseModal}) {
  const component = getComponent();

  function getComponent() {
    if(!apiResponse || typeof apiResponse !== 'object') {
      return;
    }

    return (
      <>
        <div>
          <Typography variant="h4" className='melindaHeader'>
            <FormattedMessage id="melinda.response.header" />
          </Typography>

          {/* Created records */}
          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography>
                <FormattedMessage id="melinda.response.records" />
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Array.isArray(apiResponse?.records) && apiResponse.records.map((record, idx) => getRecordItem(record, idx))}
              {Array.isArray(apiResponse?.records) && apiResponse.records.length === 0 && <FormattedMessage id="melinda.response.noCreatedRecords" />}
            </AccordionDetails>
          </Accordion>

          {/* Errors */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
            >
              <Typography>
                <FormattedMessage id="melinda.response.errors" /> ({apiResponse?.errors?.length} kpl)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {Array.isArray(apiResponse?.errors) && apiResponse.errors.map((error, idx) => getErrorItem(error, idx))}
            </AccordionDetails>
          </Accordion>
        </div>
      </>
    );

    function getRecordItem(record, idx) {
      const {databaseId, recordStatus, recordMetadata} = record;
      const standardIdentifiers = recordMetadata?.standardIdentifiers?.join(', ');
      const databaseIdentifiers = record?.ids?.join(', ');

      return (
        <div key={idx} className='melindaItem'>
          <Typography>
            <FormattedMessage id="melinda.response.databaseId" />: {databaseId ?? 'Unknown ID'}
          </Typography>
          <Typography>
            <FormattedMessage id="melinda.response.itemStatus" />: {recordStatus ?? 'Unknown status'}
          </Typography>
          <Typography>
            <FormattedMessage id="melinda.response.standardIdentifiers" />: {standardIdentifiers ?? '-'}
          </Typography>
          <Typography>
            <FormattedMessage id="melinda.response.databaseIds" />: {databaseIdentifiers ?? '-'}
          </Typography>
        </div>
      );
    }

    function getErrorItem(error, idx) {
      const {status, payload} = error;

      return (
        <div key={idx} className='melindaItem'>
          <Typography>
            <FormattedMessage id="melinda.response.errorStatus" />: {status ?? 'Unknown status'}
          </Typography>
          <Typography>
            <FormattedMessage id="melinda.response.errorPayload" />: {payload ?? 'Unknown error'}
          </Typography>
        </div>
      );
    }
  }

  return (
    <>
      <Modal open={apiResponse !== null} onClose={() => closeMelindaResponseModal()}>
        <Box className="melindaResultModal">{component}</Box>
      </Modal>
    </>
  );
}

MelindaResponseModal.propTypes = {
  apiResponse: PropTypes.object,
  closeMelindaResponseModal: PropTypes.func.isRequired
};

export default MelindaResponseModal;
