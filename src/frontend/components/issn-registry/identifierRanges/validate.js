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

import {regexPatterns} from '/src/frontend/components/common/validation';

export function validate(values) {
  const errors = {};
  const requiredFields = ['block', 'rangeBegin', 'rangeEnd'];

  // Validate required fields have value
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'field.required';
    }
  });

  // Validate block, rangeBegin and rangeEnd are integers
  if (values.block && !regexPatterns.integerString.test(values.block)) {
    errors.block = 'format.integer';
  }

  if (values.rangeBegin && !regexPatterns.integerString.test(values.rangeBegin)) {
    errors.rangeBegin = 'format.integer';
  }

  if (values.rangeEnd && !regexPatterns.integerString.test(values.rangeEnd)) {
    errors.rangeEnd = 'format.integer';
  }

  // Validate lengths
  validateLength('block', 4);
  validateLength('rangeBegin', 3);
  validateLength('rangeEnd', 3);

  function validateLength(itemName, length) {
    if (values[itemName]) {
      if (values[itemName].length < length) {
        errors[itemName] = 'format.minLength';
        return;
      }

      if (values[itemName].length > length) {
        errors[itemName] = 'format.maxLength';
        return;
      }
    }
  }

  // Validate range start and end
  if (values.rangeBegin && values.rangeEnd && Number(values.rangeBegin) > Number(values.rangeEnd)) {
    errors.rangeEnd = 'ranges.validity';
  }

  return errors;
}
