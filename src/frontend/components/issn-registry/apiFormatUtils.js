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

export function createInfoObj(entities, keys) {
  const result = keys.reduce((prev, acc) => ({...prev, [acc]: []}), {});

  entities.forEach(entity => {
    keys.forEach(key => {
      if(entity[key]) {
        return result[key].push(entity[key]);
      }
      // Insert empty string if there is no value to insert
      return result[key].push('');
    });
  });

  return containsInformation(result) ? result : keys.reduce((prev, acc) => ({...prev, [acc]: ['']}), {});
}

// Creates objects with properties from separate lists containing those properties
export function createEntities(infoObj, keys) {
  const result = [];
  const numEntities = getEntityAmount(infoObj);
  for(let i = 0; i < numEntities; i++) {
    const entity = {};
    keys.forEach(key => {
      entity[key] = infoObj[key].length > i ? infoObj[key][i] : '';
    });

    result.push(entity);
  }

  // Strip objects that contain only arrays with one empty value. By default one entry for each attribute is inserted similar to old implementation
  return result;

  // Get amount of entities that should be produced
  function getEntityAmount(infoObj) {
    let maxLength = 0;

    // Take account all the special cases where no there is no information to display
    if(infoObj === null || infoObj === undefined || infoObj === '') {
      return maxLength;
    }

    if (typeof infoObj !== 'object') {
      throw new Error('Value that should have been array was not. Refusing to render.');
    }

    // Validate all properties are arrays
    Object.values(infoObj).forEach(v => {
      if(!Array.isArray(v) && v !== null) {
        throw new Error('Value that should have been array was not. Refusing to render.');
      }

      if(v === null) {
        return;
      }

      maxLength = maxLength > v.length ? maxLength : v.length;
      return;
    });

    return maxLength;
  }
}

export function containsInformation(obj) {
  return Object.values(obj).filter(v => v.length > 0).length > 0;
}
