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

/* eslint-disable no-unused-vars */
export const formatPublicationValues = (values) => {
  // Remove fields that can not be updated and should not be sent to the API
  const {
    publisherId,
    publisherName,
    printFormat,
    publicationIdentifierPrint,
    publicationIdentifierElectronical,
    publicationIdentifierType,
    publicationTime, // Note publicationTime values are initialized only if value has been changed
    identifierBatchId,
    type,
    typeOther,
    fileformat,
    fileformatOther,
    onProcess,
    noIdentifierGranted,
    publicationsIntra,
    publicationsPublic,
    publicationType,
    publicationFormat,
    hasAssociatedMessage,
    id,
    ...updatedValues
  } = {
    ...values,
    // Ensure that empty comments are also sent to the backend (to be able to clear them)
    comments: values.comments ? values.comments : '',
    year: values.publicationTime ? values.publicationTime.year().toString() : values.year.toString(),
    month: values.publicationTime
      ? (1 + values.publicationTime.month()) < 10 // In moment months are zero-indexed
        ? `0${1 + values.publicationTime.month()}`.toString() // Check if month is single digit and add leading zero
        : (1 + values.publicationTime.month()).toString()
      : values.month.toString(),
    role1: values.role1.map(value => value.value),
    role2: values.role2.map(value => value.value),
    role3: values.role3.map(value => value.value),
    role4: values.role4.map(value => value.value)
  };

  return updatedValues;
};

export const formatPublicationRequestValues = (values) => {
  // Remove fields that can not be updated and should not be sent to the API
  const {
    publisherId,
    publisherName,
    printFormat,
    publicationIdentifierPrint,
    publicationIdentifierElectronical,
    publicationIdentifierType,
    identifierBatchId,
    hasAssociatedMessage,
    ...updatedValues
  } = {
    ...values,
    // Ensure that empty comments are also sent to the backend (to be able to clear them)
    comments: values.comments ? values.comments : '',
    year: values.year.toString(),
    month: values.month.toString(),
    role1: values.role1.map(value => value.value),
    role2: values.role2.map(value => value.value),
    role3: values.role3.map(value => value.value),
    role4: values.role4.map(value => value.value),
    fileformat: values.fileformat.map(value => value.value),
    type: values.printFormat.map(value => value.value)
  };

  return updatedValues;
};
