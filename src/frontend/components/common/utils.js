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

import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import RenderSelect from '/src/frontend/components/common/form/render/RenderSelect.jsx';

// Required to avoid focus issues on edit (component={renderTextField}})
// NB! component={(props) => <RenderTextField {...props}/>} approach does not work here for some reason
export const renderSelect = (props) => <RenderSelect {...props} />;
export const renderTextField = (props) => <RenderTextField {...props} />;

export function element({item, intl}) {
  if (item.type === 'select') {
    // Language & Message type
    return (
      <Field
        className="selectField"
        // See comment above about the renderSelect function
        component={renderSelect}
        label={intl.formatMessage({id: item.label})}
        name={item.name}
        type={item.type}
        options={item.options}
      />
    );
  }

  // Theme & Subject
  if (item.type === 'text') {
    return (
      <Field
        className="textField"
        // See comment above about the renderTextField function
        component={renderTextField}
        label={item.label}
        name={item.name}
        type={item.type}
      />
    );
  }

  return null;
}
