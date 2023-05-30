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

import {createInfoObj, createEntities} from '/src/frontend/components/issn-registry/apiFormatUtils';

/**
 * Transform ISSN publisher object JSONified attribute contactPerson objects to be compatible with api/db schema.
 * Enforces having one value for each JSONified attribute defined to preserve the structure and allow deletion of all values.
 * This also allows repairing the NULL or empty string values that may be in DB by just resaving -> during save the structure is forced.
 * - From: {...publisher, contactPerson: [{name: 'foo', email: 'foo@test.com'}, {title: 'bar', issn: 'bar@test.com'}]}
 * - To: {...publisher, contactPerson: {name: ['foo', 'bar'], email: ['foo@test.com', 'bar@test.com']}}
 */
export const formatToApi = (values) => {
  const {
    contactPerson,
    ...publisher
  } = values;

  const formattedAttributes = {
    contactPerson: contactPerson ? createInfoObj(contactPerson, ['name', 'email']) : undefined
  };

  return {
    ...publisher,
    ...formattedAttributes
  };
};

/**
 * Transform ISSN publisher object JSONified attribute contactPerson from api/db schema to be reasonable for editing/displaying in UI
 * - From: {...publisher, contactPerson: {name: ['foo', 'bar'], email: ['foo@test.com', 'bar@test.com']}}
 * - To: {...publisher, contactPerson: [{name: 'foo', email: 'foo@test.com'}, {title: 'bar', issn: 'bar@test.com'}]}
 */
export const formatFromAPI = (apiValue) => {
  const {
    contactPerson,
    ...publisher
  } = apiValue;

  return {
    ...publisher,
    contactPerson: createEntities(contactPerson, ['name', 'email'])
  };
};

