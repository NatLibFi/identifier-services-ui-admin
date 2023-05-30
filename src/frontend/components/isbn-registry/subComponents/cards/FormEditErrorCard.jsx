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
import {FormattedMessage} from 'react-intl';
import {Typography} from '@mui/material';

function FormEditErrorCard({valid, errors}) {
  return (
    <div className="errorMessageContainer">
      {!valid && (
        <>
          <Typography variant="body2" className="errorText">
            <FormattedMessage id="error.formEdit" />
          </Typography>

          {Object.keys(errors).map((key, index) => {
            return (
              <li key={index} className="errorText">
                <FormattedMessage id={`error.${key}`} />
              </li>
            );
          })}
        </>
      )}
    </div>
  );
}

FormEditErrorCard.propTypes = {
  valid: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired
};

export default FormEditErrorCard;
