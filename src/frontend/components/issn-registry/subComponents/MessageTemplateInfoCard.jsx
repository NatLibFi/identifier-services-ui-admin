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

import {Typography, Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';

function MessageTemplateInfocard() {
  return (
    <Accordion className="templateCreationInstructions">
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography className="templateCreationInstructionsHeader">
          <InfoIcon />
          <FormattedMessage id="messages.templates.form.instructions" />
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Typography>
            <FormattedMessage id="messages.templates.form.instructions.header" />
          </Typography>
          <ul>
            <li>
              <span>#TITLE#</span>
              <FormattedMessage id="messages.templates.form.instructions.title" />
            </li>
            <li>
              <span>#EMAIL#</span>
              <FormattedMessage id="messages.templates.form.instructions.issn.email" />
            </li>
            <li>
              <span>#CONTACT_PERSON#</span>
              <FormattedMessage id="messages.templates.form.instructions.contactPerson" />
            </li>
            <li>
              <span>#PUBLISHER#</span>
              <FormattedMessage id="messages.templates.form.instructions.issn.publisher" />
            </li>
            <li>
              <span>#PUBLICATIONS#</span>
              <FormattedMessage id="messages.templates.form.instructions.publications" />
            </li>
            <li>
              <span>#ADDRESS#</span>
              <FormattedMessage id="messages.templates.form.instructions.issn.address" />
            </li>
            <li>
              <span>#DATE#</span>
              <FormattedMessage id="messages.templates.form.instructions.date" />
            </li>
            <li>
              <span>#USER#</span>
              <FormattedMessage id="messages.templates.form.instructions.user" />
            </li>
          </ul>
          <div className="instructionsText">
            <Typography>
              <FormattedMessage id="messages.templates.form.instructions.example" />
            </Typography>
            <span>
              <Typography>#PUBLISHER#</Typography>
              <Typography className="lineBreak">#ADDRESS#</Typography>
              <Typography className="lineBreak">#CONTACT_PERSON#</Typography>
              <Typography className="lineBreak">
                <FormattedMessage id="messages.templates.form.instructions.example.message" />
              </Typography>
              <Typography className="lineBreak">
                <FormattedMessage id="messages.templates.form.instructions.example.publications" />
                #PUBLICATIONS#
              </Typography>
              <Typography>
                <FormattedMessage id="messages.templates.form.instructions.example.regards" />
              </Typography>
              <Typography>#USER#</Typography>
            </span>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}

export default MessageTemplateInfocard;
