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

import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {Switch, withRouter, useLocation} from 'react-router-dom';
import moment from 'moment';

import {hasAuthParams, useAuth} from 'react-oidc-context';

import {Grid} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Main common components
import CustomRoute from '/src/frontend/components/common/CustomRoute.jsx';
import CustomizedSnackbar from '/src/frontend/components/common/CustomizedSnackbar.jsx';
import ErrorPage from '/src/frontend/components/common/ErrorPage.jsx';

// Navigation components
import TopNav from '/src/frontend/components/common/navbar/TopNav.jsx'; // dark blue top navigation component
import DefaultNav from '/src/frontend/components/common/navbar/DefaultNav.jsx'; // white default nav bar
import IsbnNavbar from '/src/frontend/components/isbn-registry/IsbnNavbar.jsx'; // teal ISBN nav bar
import IssnNavbar from '/src/frontend/components/issn-registry/IssnNavbar.jsx'; // green ISSN nav bar

// Routes
import {routeList} from '/src/frontend/routes';

import '/src/frontend/css/global.css';
import '/src/frontend/css/app.css';

function App(props) {
  const {configuration, history} = props;
  const auth = useAuth();

  // Language control - Admin UI uses only FI at this point
  const language = 'fi';
  const location = useLocation();
  moment.locale(language); // Note: this will set language in global context.

  // Get type of registry based on URL or local storage, if URL does not contain information
  function getTypeOfService(url) {
    if (/isbn-registry/u.exec(url)) {
      return 'isbn';
    }

    if (/issn-registry/u.exec(url)) {
      return 'issn';
    }

    const localStorageType = window.localStorage.getItem('typeOfService');
    return localStorageType ?? 'isbn';
  }

  // App state
  const [typeOfService, setTypeOfService] = useState(getTypeOfService(location.pathname));
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  // Props that are passed to child components
  const {user} = auth;
  const authenticationToken = user ? user.access_token : null;
  const userInfo = user ? {...auth.user, isAuthenticated: true, authenticationToken} : {isAuthenticated: false};

  const childProps = {
    authenticationToken,
    userInfo,
    configuration,
    language,
    setSnackbarMessage
  };

  // Redirect to auth
  useEffect(() => {
    if(!hasAuthParams() && !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading) {
      auth.signinRedirect();
    }
  }, [auth.isAuthenticated, auth.activeNavigator, auth.isLoading, auth.signinRedirect]);

  // Make sure that the display bar stays appropriate every time the url changes
  useEffect(() => {
    setTypeOfService(getTypeOfService(location.pathname));
  }, [location]);

  const routes = (
    <>
      {routeList.map((route) => (
        <CustomRoute
          key={route.path}
          routeDefinition={route}
          isPrivate={false}
          props={{...props, ...childProps}}
        />
      ))}
    </>
  );

  // Do not display page when loading or if not authenticated
  // If user is not authenticated, a redirection to authentication service should happen
  if(!auth.isAuthenticated) {
    return;
  }

  return (
    <>
      <a href="#main-content" className="skipLink">
        <FormattedMessage id="common.skipLink" />
      </a>
      <Grid container className={'appWrapper'}>
        <Grid container item xs={12}>
          <TopNav
            history={history}
            userInfo={userInfo}
            configuration={configuration}
            typeOfService={typeOfService}
            setTypeOfService={setTypeOfService}
          />
        </Grid>
        <Grid container item xs={12}>
          <CssBaseline />
        </Grid>
        <>
          <Grid container item xs={12}>
            {!auth.isAuthenticated ? (
              <DefaultNav />
            ) : typeOfService === 'issn' ? (
              <IssnNavbar userInfo={userInfo} />
            ) : (
              <IsbnNavbar userInfo={userInfo} />
            )}
          </Grid>
          <Grid container item xs={12} className="bodyContainer" id="main-content">
            {configuration.maintenance && (
              <ErrorPage errorType={'SERVICE_UNDER_MAINTENANCE'} />
            )}
            {!configuration.maintenance && <Switch>{routes}</Switch>}
            {snackbarMessage && (
              <CustomizedSnackbar
                message={snackbarMessage}
                setMessage={setSnackbarMessage}
              />
            )}
          </Grid>
        </>
      </Grid>
    </>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
  configuration: PropTypes.object.isRequired
};

export default withRouter(App);
