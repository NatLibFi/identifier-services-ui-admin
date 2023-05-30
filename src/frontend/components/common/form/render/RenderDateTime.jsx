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
import moment from 'moment';

import {TextField} from '@mui/material';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

import '/src/frontend/css/forms/renderDateTime.css';
import DateInfoCard from '/src/frontend/components/common/subComponents/DateInfoCard.jsx';

function RenderDateTime (props) {
  const {input, label, min, max, info, inputFormat, helperText, views, currentValue} = props;

  const getValue = () => {
    if (input.value) {
      return moment(input.value);
    }

    if (info) {
      return null;
    }

    return currentValue;
  };

  const getHelperText = () => {
    if (moment(input.value).isBefore(moment(min))) {
      return <FormattedMessage id="error.date.min" />;
    }

    if (input.value && !input.value._isValid) {
      return <FormattedMessage id="error.date.invalid" />;
    }

    return helperText ?? <FormattedMessage id="common.datePicker.helperText" />;
  };

  return (
    <>
      <div className="dateContainer">
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={'fi'}>
          <DatePicker
            clearable
            inputFormat={inputFormat ?? 'MM/YYYY'}
            views={views ?? ['year', 'month']}
            value={getValue()}
            minDate={moment(min)}
            maxDate={moment(max)}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                helperText={getHelperText()}
              />
            )}
            onChange={input.onChange}
          />
        </LocalizationProvider>
      </div>

      {/* Displaying info cards with different content depending on page type (isbn form or statistics form) */}
      {info && <DateInfoCard type={info} />}
    </>
  );
}

RenderDateTime.propTypes = {
  input: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  min: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  max: PropTypes.string,
  info: PropTypes.string,
  inputFormat: PropTypes.string,
  helperText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  views: PropTypes.array,
  currentValue: PropTypes.string
};

export default RenderDateTime;
