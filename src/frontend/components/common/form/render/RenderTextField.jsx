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
import {useIntl} from 'react-intl';
import {PropTypes} from 'prop-types';

import {TextField, InputAdornment, Typography} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import '/src/frontend/css/errorMessage.css';

function RenderTextField(props) {
  const {
    input,
    label,
    className,
    infoIconComponent,
    type,
    meta: {touched, error},
    disabled,
    errors,
    ...custom
  } = props;
  const intl = useIntl();

  return (
    <TextField
      {...input}
      label={label}
      disabled={disabled}
      type={input.name === 'password' ? input.type : type}
      className={className}
      variant="outlined"
      error={touched && Boolean(error)}
      inputProps={{...custom}}
      InputLabelProps={{shrink: true}}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <>
              {touched && error && (
                <Typography
                  variant="caption"
                  color="error"
                  className='errors'
                >
                  <ErrorIcon fontSize="inherit"/>
                  {intl.formatMessage({id: `error.${error}`})}
                </Typography>
              )}
              {touched && errors && (
                <Typography
                  variant="caption"
                  color="error"
                  className='errors'
                >
                  <ErrorIcon fontSize="inherit"/>
                  {intl.formatMessage({id: `error.${error}`})}
                </Typography>
              )}
            </>
            {infoIconComponent && infoIconComponent}
          </InputAdornment>
        )
      }}
    />
  );
}

RenderTextField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  infoIconComponent: PropTypes.object,
  type: PropTypes.string,
  meta: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  errors: PropTypes.bool
};

export default RenderTextField;
