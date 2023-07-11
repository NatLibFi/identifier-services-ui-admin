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

import React, {useEffect, useState} from 'react';

import {AuthProvider} from 'react-oidc-context';
import {BrowserRouter as Router} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import App from '/src/frontend/App.jsx';
import translations from '/src/frontend/translations';

import {getConfig} from '/src/frontend/actions';

function AppWrapper() {
  const [configuration, setConfiguration] = useState({});
  const language = 'fi';

  // Load application config from server
  useEffect(() => {
    async function fetchConfig() {
      const fetchedConfig = await getConfig();
      setConfiguration(fetchedConfig);
    }

    fetchConfig();
  }, []);

  function validateOidcConfig(configuration) {
    if(typeof configuration !== 'object') {
      return false;
    }

    const requiredKeys = ['authority', 'client_id'];
    return requiredKeys.every(key => Object.keys(configuration).includes(key));
  }

  if(!validateOidcConfig(configuration.oidcConfig)) {
    return (<p>Virhe! Ota yhteys järjestelmäylläpitoon.</p>);
  }

  const oidcConfig =  {
    ...configuration.oidcConfig,
    redirect_uri: window.location.href,
    onSigninCallback: (user) => { // eslint-disable-line no-unused-vars
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  };

  return (
    <AuthProvider {...oidcConfig}>
      <Router>
        <IntlProvider locale={language} messages={translations}>
          <App configuration={configuration}/>
        </IntlProvider>
      </Router>
    </AuthProvider>
  );
}

export default AppWrapper;
