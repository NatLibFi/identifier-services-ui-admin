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

import React, {createContext} from 'react';

import {AuthProvider} from 'react-oidc-context';
import {BrowserRouter as Router} from 'react-router-dom';
import {IntlProvider} from 'react-intl';

import {createTheme, ThemeProvider} from '@mui/material';

import {AppStateProvider} from '/src/frontend/providers/AppStateProvider';

import App from '/src/frontend/App.jsx';
import ErrorPage from '/src/frontend/components/common/ErrorPage.jsx';

import Spinner from '/src/frontend/components/common/Spinner.jsx';

import translations from '/src/frontend/translations';

import useConfig from './hooks/useConfig';

const RuntimeEnvContext = createContext(undefined);

function AppWrapper() {
  const {data: runtimeConfig, loading, error} = useConfig();
  const isTestInstance = runtimeConfig.environment !== 'production';

  // MUI theme provider
  // - Disable ripple effect globally from all buttons

  // Regarding the MUI theme definition:
  //   - From docs example given in: https://mui.com/material-ui/customization/theme-components/#theme-default-props
  //   - Original source code: https://github.com/mui/material-ui/blob/v5.15.14/docs/data/material/customization/theme-components/DefaultProps.js
  //   - License: MIT (https://github.com/mui/material-ui/blob/v5.15.14/LICENSE)
  const theme = createTheme({
    components: {
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true
        }
      }
    }
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorPage errorMessage={'Palvelin ei vastaa kutsuihin. Ole hyvä ja ota yhteys järjestelmäylläpitoon.'} />;
  }

  if (runtimeConfig.maintenance) {
    return <ErrorPage errorMessage={'Palvelin on huoltotilassa. Ole hyvä ja ota tarvittaessa yhteys järjestelmäylläpitoon.'} />;
  }

  return (
    <AuthProvider {...runtimeConfig.oidcConfig}>
      <Router>
        <IntlProvider locale={'fi'} messages={translations}>
          <RuntimeEnvContext.Provider value={isTestInstance}>
            <AppStateProvider>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </AppStateProvider>
          </RuntimeEnvContext.Provider>
        </IntlProvider>
      </Router>
    </AuthProvider>
  );
}

export {AppWrapper, RuntimeEnvContext};
