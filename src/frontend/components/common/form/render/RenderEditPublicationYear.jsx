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
import {Field} from 'react-final-form';
import moment from 'moment';
import PropTypes from 'prop-types';

import RenderSelect from './RenderSelect.jsx';

function RenderEditPublicationYear({value}) {
  // Get the current year and set it and the next 5 years as options
  const getYearOptions = () => {
    const currentYear = moment().year();
    const years = [
      currentYear,
      currentYear + 1,
      currentYear + 2,
      currentYear + 3,
      currentYear + 4,
      currentYear + 5
    ];
    const options = [
      {label: '', value: ''},
      ...years.map((year) => ({label: year, value: year}))
    ];

    return options;
  };

  return (
    <Field
      name="year"
      type="select"
      component={(props) => <RenderSelect {...props}/>}
      options={getYearOptions()}
      currentValue={value}
    />
  );
}

RenderEditPublicationYear.propTypes = {
  value: PropTypes.string.isRequired
};

export default RenderEditPublicationYear;
