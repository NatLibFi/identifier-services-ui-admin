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
 * Transform ISSN publication object JSONified attributes (previous, mainSeries, subseries, anotherMedium) objects to be compatible with api/db schema.
 * Enforces having one value for each JSONified attribute defined to preserve the structure and allow deletion of all values.
 * This also allows repairing the NULL or empty string values that may be in DB -> during save the structure is forced.
 * - From: {...publication, [attribute]: [{title: 'foo', issn: '1234-1234'}, {title: 'bar', issn: '1234-4321'}]}
 * - To: {...publication, [attribute]: {title: ['foo', 'bar'], issn: ['1234-1234', '1234-4321']}}
 */
export const formatToApi = (values) => {
  const {
    anotherMedium,
    mainSeries,
    previous,
    subseries,
    publisher, // eslint-disable-line
    ...publication
  } = values;

  const formattedAttributes = {
    previous: previous ? createInfoObj(previous, ['title', 'issn', 'lastIssue']) : undefined,
    mainSeries: mainSeries ? createInfoObj(mainSeries, ['title', 'issn']) : undefined,
    subseries: subseries ? createInfoObj(subseries, ['title', 'issn']) : undefined,
    anotherMedium: anotherMedium ? createInfoObj(anotherMedium, ['title', 'issn']) : undefined
  };

  return {
    ...publication,
    ...formattedAttributes
  };
};

/**
 * Transform ISSN publication object JSONified attributes (previous, mainSeries, subseries, anotherMedium) from api/db schema to be reasonable for editing/displaying in UI
 * - From: {...publication, [attribute]: {title: ['foo', 'bar'], issn: ['1234-1234', '1234-4321']}}
 * - To: {...publication, [attribute]: [{title: 'foo', issn: '1234-1234'}, {title: 'bar', issn: '1234-4321'}]}
 */
export const formatFromAPI = (apiValue) => {
  const {
    anotherMedium,
    mainSeries,
    previous,
    subseries,
    ...publication
  } = apiValue;

  return {
    ...publication,
    previous: createEntities(previous, ['title', 'issn', 'lastIssue']),
    mainSeries: createEntities(mainSeries, ['title', 'issn']),
    subseries: createEntities(subseries, ['title', 'issn']),
    anotherMedium: createEntities(anotherMedium, ['title', 'issn'])
  };
};
