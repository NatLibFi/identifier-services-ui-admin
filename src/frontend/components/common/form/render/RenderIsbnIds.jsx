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
import {v4 as uuidv4} from 'uuid';
import PropTypes from 'prop-types';

import {IconButton, Tooltip} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

function RenderIsbnIds(props) {
  const {value, cancelId, removeId, format} = props;
  // Parses ISBN/ISMN identifiers as they are stored as stringified JSON
  // Using try-catch to avoid crashing, since the value in the database could be '' by default
  function parseIdentifiers(v) {
    try {
      return JSON.parse(v);
    } catch (_) {
      return {};
    }
  }
  const identifiersObject = parseIdentifiers(value);
  return (
    <div>
      <ul className="isbnContainer">
        {Object.entries(identifiersObject).map(([identifier, type]) => (
          <li key={uuidv4()}>
            {identifier}
            {': '}
            <FormattedMessage
              id={`form.${
                format === 'print' ? 'printFormat' : 'fileFormat'
              }.${type.toLowerCase()}`}
            />
            <div>
              <Tooltip title={<FormattedMessage id="form.button.label.cancel" />}>
                <IconButton
                  aria-label="cancel"
                  onClick={() => cancelId(identifier)}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={<FormattedMessage id="form.button.label.delete" />}>
                <IconButton
                  aria-label="delete"
                  onClick={() => removeId(identifier)}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

RenderIsbnIds.propTypes = {
  value: PropTypes.string.isRequired,
  cancelId: PropTypes.func.isRequired,
  removeId: PropTypes.func.isRequired,
  format: PropTypes.string.isRequired
};

export default RenderIsbnIds;
