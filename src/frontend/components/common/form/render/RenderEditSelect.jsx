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
import {Field} from 'react-final-form';
import {PropTypes, oneOfType} from 'prop-types';

import {translateOptions} from './util';
import RenderSelect from './RenderSelect.jsx';

function RenderEditSelect({options, fieldName}) {
  const intl = useIntl();

  return (
    <Field
      name={fieldName}
      type="select"
      component={(props) => <RenderSelect {...props}/>}
      options={translateOptions(options, intl)}
    />
  );
}

RenderEditSelect.propTypes = {
  fieldName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
    label: PropTypes.string.isRequired
  })).isRequired
};

export default RenderEditSelect;
