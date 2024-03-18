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

import {useEffect, useState} from 'react';

import {getHeaders} from '/src/frontend/actions/util';

function useConfig() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function fetchConfig() {
      try {
        const response = await fetch('/api/config', {
          method: 'GET',
          headers: getHeaders()
        });

        if(!ignore) {
          if (response.ok) {
            const configuration = await response.json();
            configuration.oidcConfig = {
              ...configuration.oidcConfig,
              redirect_uri: window.location.href,
              onSigninCallback: () => {
                window.history.replaceState(
                  {},
                  document.title,
                  window.location.pathname
                );
              }
            };

            setData(configuration);
            setLoading(false);
            return;
          }

          throw new Error('Could not load configuration from API');
        }
      } catch (err) {
        if(!ignore) {
          setError(true);
          setLoading(false);
        }

      }
    }

    fetchConfig();

    return () => {ignore = true;};
  }, []);

  return {data, loading, error};

}

export default useConfig;
