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

import {useState, useEffect} from 'react';
import {getHeaders} from '/src/frontend/actions/util';

/*
 * Hook inspired by TanStack query (https://github.com/TanStack/query)
 *   - MIT license
 *   - Copyright (c) 2021-present Tanner Linsley
*/

export function useList({
  url,
  method,
  body,
  authenticationToken,
  dependencies,
  prefetch,
  fetchOnce,
  requireAuth,
  isModalOpen,
  modalIsUsed
}) {
  const [fetched, setFetched] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In case auth is required and store has not yet completed, do not fetch
    if (requireAuth && authenticationToken === null) {
      return;
    }

    // In case modal is used and it's was not in open state (i.e., if it was open, the dependency means it's now closing)
    if (fetched && modalIsUsed && !isModalOpen) {
      return;
    }

    async function retrieveData() {
      // Set loading flag
      setLoading(true);

      try {
        // Set request options
        const requestOpts = {
          method,
          headers: getHeaders(authenticationToken)
        };

        // If request should contain body, add it
        if (body) {
          requestOpts.body = JSON.stringify(body);
        }

        // Make the API call
        const response = await fetch(url, requestOpts);

        // If response was not ok, throw it as error for attempt to parsing API message
        if (!response.ok) {
          throw response;
        }

        // Parse response data
        const result = await response.json();

        // Set data
        setData(result);
      } catch (error) {
        // Set error status and message readable
        if (error instanceof Error) {
          setError({status: 500, message: 'Unknown error occurred'});
        }

        try {
          // Try parsing error body
          const errorBody = await error.json();
          setError({
            status: error.status ?? 500,
            message: errorBody?.message ?? 'Unknown error occurred'
          });
        } catch (err) {
          // If parsing error fails, fall back to specifying error unknown error
          setError({status: 500, message: 'Unknown error occurred'});
        }
      } finally {
        // Set loading flag to false
        setLoading(false);
      }
    }

    // Retrieve data based on prefetch config
    if (!prefetch && !initialized) {
      setInitialized(true);
      return;
    }

    if (!fetchOnce || (fetchOnce && !fetched)) {
      retrieveData();
      setFetched(true);
    }

  }, dependencies);

  return {data, loading, error};
}

export default useList;
