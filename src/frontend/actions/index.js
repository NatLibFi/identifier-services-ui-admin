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

import fetch from 'node-fetch';
import HttpStatus from 'http-status';

import {getHeaders, formatBody, redirect, removeMetadataFields} from '/src/frontend/actions/util';

/**
 * Get configuration to run the app in from express server.
 * @returns Returns parsed configuration on success and default configuration which turns on maintenance mode on failure.
 */
export async function getConfig() {
  const defaultConfig = {
    maintenance: true,
    oidcConfig: {}
  };

  try {
    const response = await fetch('/api/config', {
      method: 'GET',
      headers: getHeaders()
    });

    if (response.status === HttpStatus.OK) {
      const configuration = await response.json();
      return configuration;
    }

    throw new Error('Could not load configuration from API');
  } catch (err) {
    return defaultConfig;
  }
}

/**
  * Send any create request to API
  * @param values Values of request entry
  * @param url URL to send the request to
  * @param history History object allowing redirects
  * @param redirectRoute Redirect route to redirect. If left undefined, won't redirect.
  * @param authenticationToken Authentication token to authenticate to API with
  * @param setSnackbarMessage Function that allows display of success message.
  * @returns Returns true and redirects to home page on success, otherwise returns false
*/
export async function createRequest({values, url, history, redirectRoute, authenticationToken, setSnackbarMessage}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(authenticationToken),
      body: JSON.stringify(formatBody(values))
    });

    if (response.status === HttpStatus.CREATED) {
      setSnackbarMessage({severity: 'success', intlId: 'serviceMessage.success'});

      if(redirectRoute) {
        redirect(history, redirectRoute);
      }

      return true;
    }
    // Return API message
    const body = await response.json();

    // If body does not contain error message, fall back to generic error
    if(!body.message) {
      throw new Error();
    }

    setSnackbarMessage({severity: 'error', message: `Toiminto epäonnistui seuraavalla tarkenteella: ${body.message}`});
    return false;

  } catch (err) {
    // Return generic error message
    setSnackbarMessage({severity: 'error', intlId: 'serviceMessage.error'});
    return false;
  }
}

/**
  * Send any update request to API
  * @param values Values of request entry
  * @param url URL to send the request to
  * @param authenticationToken Authentication token to authenticate to API with
  * @param setSnackbarMessage Function that allows display of success message.
  * @returns Returns response body on success, otherwise returns false
*/
export async function updateEntry({values, url, authenticationToken, setSnackbarMessage}) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(authenticationToken),
      body: JSON.stringify(removeMetadataFields(values))
    });

    if (response.status === HttpStatus.OK) {
      setSnackbarMessage({severity: 'success', intlId: 'serviceMessage.success'});
      return response.json();
    }
    // Return API message
    const body = await response.json();

    // If body does not contain error message, fall back to generic error
    if(!body.message) {
      throw new Error();
    }

    setSnackbarMessage({severity: 'error', message: `Toiminto epäonnistui seuraavalla tarkenteella: ${body.message}`});
    return false;

  } catch (err) {
    // Return generic error message
    setSnackbarMessage({severity: 'error', intlId: 'serviceMessage.error'});
    return false;
  }
}

/**
  * Send any delete request to API
  * @param url URL to send the request to
  * @param history History object allowing redirects
  * @param redirectRoute Redirect route to redirect. If left undefined, won't redirect.
  * @param authenticationToken Authentication token to authenticate to API with
  * @param setSnackbarMessage Function that allows display of success message.
  * @returns Returns response body on success, otherwise returns false
*/
export async function deleteEntry({url, history, redirectRoute, authenticationToken, setSnackbarMessage}) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(authenticationToken)
    });

    if (response.status === HttpStatus.NO_CONTENT) {
      setSnackbarMessage({severity: 'success', intlId: 'serviceMessage.success'});
      redirect(history, redirectRoute);
      return true;
    }
    // Return API message
    const body = await response.json();

    // If body does not contain error message, fall back to generic error
    if(!body.message) {
      throw new Error();
    }

    setSnackbarMessage({severity: 'error', message: `Toiminto epäonnistui seuraavalla tarkenteella: ${body.message}`});
    return false;

  } catch (err) {
    // Return generic error message
    setSnackbarMessage({severity: 'error', intlId: 'serviceMessage.error'});
    return false;
  }
}

/**
 * Download file
 * @param {string} url URl to send request
 * @param {object} requestBody Body to send within request
 * @param {string} authenticationToken Authentication token to authenticate with
 * @returns true if download succeeded, otherwise false
 */
export async function downloadFile({url, method, requestBody, authenticationToken, downloadName=''}) {
  function getDownloadName(format) {
    if(format.includes('application/json')) return 'statistics.json';
    if(format.includes('application/vnd.ms-excel')) return 'statistics.xlsx';
    if(format.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) return 'statistics.xlsx';

    throw new Error(`Unknown format: ${format}`);
  }

  try {
    const response = await fetch(`${url}`, {
      method,
      headers: getHeaders(authenticationToken),
      body: requestBody ? JSON.stringify(formatBody(requestBody)) : undefined
    });

    if (response.status === HttpStatus.OK) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');

      a.href = url;
      a.download = downloadName === '' ? getDownloadName(blob.type) : downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      return true;
    }
    throw new Error(`API operation failed with status ${response.status}`);
  } catch (err) {
    return false;
  }
}

/**
  * Send any request to API
  * TODO: refactor all the CRUD actions to use this method
  * @param url URL to send the request to
  * @param method HTTP method
  * @param values Values to include to request body
  * @param history History object allowing redirects
  * @param redirectRoute Redirect route to redirect. If left undefined, won't redirect.
  * @param redirectState Redirect state to use during redirect operation
  * @param authenticationToken Authentication token to authenticate to API with
  * @param setSnackbarMessage Function that allows display of success message.
  * @returns Returns response body on success, otherwise returns false
*/
export async function makeApiRequest({url, method, values, history, redirectRoute, redirectState, authenticationToken, setSnackbarMessage, filterMetadataFields=false}) {
  try {
    const requestBody = filterMetadataFields ? JSON.stringify(removeMetadataFields(values)) : JSON.stringify(values);

    const response = await fetch(url, {
      method,
      headers: getHeaders(authenticationToken),
      body: requestBody
    });

    if (response.ok) {
      // Message management may be done also outside this functionality
      // Some special cases require this, such as requests to Melinda
      if(setSnackbarMessage) {
        setSnackbarMessage({severity: 'success', intlId: 'serviceMessage.success'});
      }

      if(history) {
        try {
          redirect(history, redirectRoute, redirectState);
          return;
        } catch (err) {
          console.debug('Encountered problem during redirection: ', err);
          return;
        }
      }

      const result = await response.json();
      return result;
    }
    // Return API message
    const body = await response.json();

    // If body does not contain error message, fall back to generic error
    if(!body.message) {
      throw new Error();
    }

    if(setSnackbarMessage) {
      setSnackbarMessage({severity: 'error', message: `Toiminto epäonnistui seuraavalla tarkenteella: ${body.message}`});
    }

    return false;
  } catch (err) {
    // Return generic error message
    console.debug('API request resulted into undefined error: ', err);

    if(setSnackbarMessage) {
      setSnackbarMessage({severity: 'error', intlId: 'serviceMessage.error'});
    }

    return false;
  }
}

/**
 * Send request to API to remove batch
 * @param {string} url URL to send the request to
 * @param {string} authenticationToken Authentication token to authenticate to API with
 * @param {function} setSnackbarMessage Function that allows display of success message.
 * @returns true if download succeeded, otherwise false
 */

export async function removeBatch ({url, authenticationToken, setSnackbarMessage}) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(authenticationToken)
    });

    if (response.status === HttpStatus.NO_CONTENT) {
      setSnackbarMessage({severity: 'success', intlId: 'serviceMessage.success'});
      return true;
    }
    // Return API message
    const body = await response.json();

    // If body does not contain error message, fall back to generic error
    if(!body.message) {
      throw new Error();
    }

    setSnackbarMessage({severity: 'error', message: `Toiminto epäonnistui seuraavalla tarkenteella: ${body.message}`});
    return false;

  } catch (err) {
    // Return generic error message
    setSnackbarMessage({severity: 'error', intlId: 'serviceMessage.error'});
    return false;
  }
}
