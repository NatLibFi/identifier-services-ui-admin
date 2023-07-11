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

// Calculated displayable string value regarding ISBN-registry range or publisher range available identifiers.
// Calculation is done because the database model and backend processes are done in a way, that the 'free' attribute
// does not match the number of identifiers that are available for use (since canceled items are reusable)
export const getIdentifiersAvailable = (range) => {
  if(!range || !Object.keys(range).includes('free') || !Object.keys(range).includes('canceled')) {
    return '';
  }

  if(typeof range.free !== 'number' || typeof range.canceled !== 'number') {
    return '';
  }

  return (range.free + range.canceled).toString();
};

// Calculated displayable string value regarding ISBN-registry range or publisher range taken identifiers.
// Calculation is done because the database model and backend processes are done in a way, that the 'taken' attribute
// does not match the number of identifiers that are already taken into use (canceled items are reusable and cancelation does
// not roll back the taken value)
export const getIdentifiersUsed = (range) => {
  if(!range || !Object.keys(range).includes('taken') || !Object.keys(range).includes('canceled')) {
    return '';
  }

  if(typeof range.free !== 'number' || typeof range.canceled !== 'number') {
    return '';
  }

  return (range.taken - range.canceled).toString();
};
