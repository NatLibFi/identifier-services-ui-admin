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

import {
  InputLabel,
  NativeSelect,
  FormControl,
  OutlinedInput,
  Box,
  Typography
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import '/src/frontend/css/errorMessage.css';

function RenderSelect (props) {
  const {
    label,
    input,
    name,
    options,
    defaultValue,
    isDisabled,
    meta
  } = props;

  const errAsBool = meta?.touched && Boolean(meta?.error);
  const intl = useIntl();

  return (
    <>
      <FormControl className='selectField' error={errAsBool} disabled={isDisabled}>
        <InputLabel htmlFor={label}>
          {label}
        </InputLabel>
        <NativeSelect
          {...input}
          error={errAsBool}
          id={label}
          input={<OutlinedInput name={name} label={label}/>}
          value={defaultValue ?? input?.value}
          onChange={value => input.onChange(value)}
        >
          {options?.map(item => (
            <option
              key={item.value}
              defaultValue={defaultValue}
              value={item.value}
            >
              {item.label}
            </option>
          ))}
        </NativeSelect>
      </FormControl>
      {errAsBool && (
        <Box mt={2}>
          <Typography
            variant="caption"
            color="error"
            className='selectErrors'
          >
            <ErrorIcon fontSize="inherit"/>
            {intl.formatMessage({id: `error.${meta?.error}`})}
          </Typography>
        </Box>
      )}
    </>
  );
}

RenderSelect.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  defaultValue: PropTypes.string,
  isDisabled: PropTypes.bool,
  meta: PropTypes.object
};

export default RenderSelect;
