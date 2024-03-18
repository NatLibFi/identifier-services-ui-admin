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

import React, {useEffect} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import moment from 'moment';

import {hasAuthParams, useAuth} from 'react-oidc-context';

import {Grid} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Custom contexts
import useAppState from '/src/frontend/hooks/useAppState';

// Components
import CustomizedSnackbar from '/src/frontend/components/common/CustomizedSnackbar.jsx';

import TopNav from '/src/frontend/components/common/navbar/TopNav.jsx'; // dark blue top navigation component
import MainNav from '/src/frontend/components/common/navbar/MainNav.jsx'; // teal or green bar depending on type of service

// Routes
import {routeList} from '/src/frontend/routes';

import '/src/frontend/css/global.css';
import '/src/frontend/css/app.css';

function App() {
  //console.log('[App.rerender]');
  const auth = useAuth();
  const {language} = useAppState();

  moment.locale(language); // Note: this will set moment language in global context, no need to reapply.

  // Redirect to auth when user is not signed in
  useEffect(() => {
    if (!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  // Sanity check: never display page when user is not authenticated
  // If user is not authenticated, a redirection to authentication service should happen automatically
  if (!auth.isAuthenticated) {
    return;
  }

  return (
    <>
      <Grid container className={'appWrapper'}>
        <Grid container item xs={12}>
          <TopNav />
        </Grid>
        <Grid container item xs={12}>
          <CssBaseline />
        </Grid>
        <>
          <MainNav />
          <Grid container item xs={12} className="bodyContainer" id="main-content">
            <CustomizedSnackbar />
            <Switch>
              {routeList.map((route) => (
                <Route
                  key={route.path}
                  exact
                  path={route.path}
                  render={() => <route.component />}
                />
              ))}
            </Switch>
          </Grid>
        </>
      </Grid>
    </>
  );
}

export default withRouter(App);
