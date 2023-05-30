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

import React, {useEffect} from 'react';
import {PropTypes} from 'prop-types';
import {useIntl} from 'react-intl';

import {TextField, InputAdornment, Typography} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

function RenderTextArea (props) {
  const {input, label, className, errors, meta: {touched, error}, children, placeholder, ariaLabel} = props;
  const intl = useIntl();

  // This seems to be the only way to set the aria-label for the textarea inside the TextField
  // It is needed since MUI creates the second textarea with aria-hidden="true" dynamically and we can't set the aria-label directly on it
  useEffect(() => {
    const textarea = document.querySelector('textarea[aria-hidden="true"]');
    if (textarea && ariaLabel) {
      textarea.setAttribute('aria-label', intl.formatMessage({id: ariaLabel}));
    }
  }, []);

  return (
    <TextField
      {...input}
      multiline
      label={label}
      aria-label={ariaLabel ? intl.formatMessage({id: ariaLabel}) : 'unknown'}
      variant="outlined"
      placeholder={placeholder}
      rows={10}
      // ListComponent set the max width to 50%, so we need to set it to 200% in this case to make it fill the whole width
      sx={{minWidth: '200%'}}
      className={className}
      error={touched && Boolean(error)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <>
              {touched && error && (
                <Typography
                  variant="caption"
                  color="error"
                  className='textAreaErrors'
                >
                  <ErrorIcon fontSize="inherit"/>
                  {intl.formatMessage({id: `error.${error}`})}
                </Typography>
              )}
              {touched && errors && (
                <Typography
                  variant="caption"
                  color="error"
                  className='textAreaErrors'
                >
                  <ErrorIcon fontSize="inherit"/>
                  {intl.formatMessage({id: `error.${error}`})}
                </Typography>
              )}
            </>
          </InputAdornment>
        )
      }}
    >
      {/*<pre> wrapper is used to preserve line breaks */}
      <pre className='comments'>
        {children}
      </pre>
    </TextField>
  );
}

RenderTextArea.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.object,
  meta: PropTypes.object.isRequired,
  children: PropTypes.node,
  placeholder: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default RenderTextArea;
