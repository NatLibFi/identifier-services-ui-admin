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

/**
 * Set request headers
 * @param {string} authenticationToken Authentication token
 * @returns HTTP request headers
 */
export function getHeaders(authenticationToken) {
  if(!authenticationToken) {
    return {'Content-Type': 'application/json'};
  }

  return {
    Authorization: `Bearer ${authenticationToken}`,
    'Content-Type': 'application/json'
  };
}

/**
 * Redirects to path or refreshes the page using static setTimeout
 * @param {Object} history History object
 * @param {string} path Path to redirect (if empty, refreshes page)
 */
export function redirect(history, pathname = '', state={}) {
  const redirectTime = 500;

  if (pathname === '' || (history.location && history.location.pathname === pathname)) {
    setTimeout(history.go(0), redirectTime); // njsscan-ignore: eval_nodejs
    return;
  }

  setTimeout(history.push({pathname, state}), redirectTime); // njsscan-ignore: eval_nodejs
  return;
}

/**
 * Strip empty values from request bodies and return stringified JSON
 * @param body Body object
 */
export function formatBody(body) {
  return Object.entries(body).reduce((acc, [k, value]) => isNullOrUndefined(value) ? {...acc} : {...acc, [k]: value}, {});

  function isNullOrUndefined(value) {
    return value === undefined || value === null;
  }
}

/**
 * This function is used to strip data and metadata fields for request payloads that are not accepted to be altered by API.
 * @param {Object} values Values to be sent as update
 * @param {boolean} keepIssn Whether to keep ISSN value in request or not: this is ok for ISBN-registry but not ok for ISSN-registry
 * @returns Object that has been stripped of metadata fields
 */
export function removeMetadataFields(values, keepIssn=false) {
  // NB: note that in addition to metadata fields also other fields that should not be updated directly are removed here
  // Removing these fields should result into api error in validation (and worse case is that it doesn't if there is any problem with validation)
  // DO NOT remove these unless you know what you are doing exactly. These removals are shared between registries.

  /* eslint-disable no-unused-vars */
  const {id, idOld, created, createdBy, modified, modifiedBy, sent, sentBy,
    publicationCount, publicationCountIssn, formId, publisherCreated, publicationIssn, issn, publisherId,
    ...formattedDoc} = values;
  /* eslint-enable no-unused-vars */

  // This is not a smart fix for the bug where ISSN is lost in ISBN publication update, but it's cost-efficient
  if(keepIssn) {
    formattedDoc.issn = values.issn;
  }

  return formatBody(formattedDoc);
}
