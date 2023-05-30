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

/** Minimal validation for publisher update form (admin only) */
export function validate(values) {
  const errors = {};
  const requiredFields = ['officialName', 'emailCommon'];

  // Validate required fields have value
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'field.required';
    }
  });

  if (values?.email_common && !regexPatterns.email.test(values.email_common)) {
    errors.email_common = 'format.email';
  }

  if (values?.phone && !regexPatterns.phone.test(values.phone)) {
    errors.phone = 'format.phone';
  }

  if (values?.zip && !regexPatterns.zip.test(values.zip)) {
    errors.zip = 'postalAddress.zip.format';
  }

  return errors;
}
