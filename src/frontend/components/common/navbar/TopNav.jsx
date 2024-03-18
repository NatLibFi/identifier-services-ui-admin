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

import React from 'react';
import {Link, useHistory} from 'react-router-dom';

import {useAuth} from 'react-oidc-context';
import {FormattedMessage, useIntl} from 'react-intl';

import {
  AppBar,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import NewspaperIcon from '@mui/icons-material/Newspaper';

import useAppState from '/src/frontend/hooks/useAppState';
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useRuntimeEnv from '/src/frontend/hooks/useRuntimeConfig';

import '/src/frontend/css/navigationBar/topNav.css';

import LogoutButton from '/src/frontend/components/common/subComponents/LogoutButton.jsx';

function TopNav() {
  const history = useHistory();
  const {user} = useAuth();
  const isTestInstance = useRuntimeEnv();

  const {typeOfService} = useAppState();
  const appStateDispatch = useAppStateDispatch();

  const intl = useIntl();

  function handleServiceTypeChange(event) {
    window.localStorage.setItem('identifierServicesAdmin.typeOfService', event.target.value);
    appStateDispatch({typeOfService: event.target.value});
    history.push('/');
  }

  return (
    <AppBar position="static" className="appBar">
      {/* Test header */}
      {isTestInstance && (
        <div className="testHeader">
          THIS IS A TEST ENVIRONMENT / TÄMÄ ON TESTIYMPÄRISTÖ
        </div>
      )}

      <div className="navbarContainer">
        <div className="navbarInnerContainer">
          <Link to="/" className="mainLogo">
            <img
              src="https://extra.kansalliskirjasto.fi/kk_logo.svg"
              alt={intl.formatMessage({id: 'altText.logo.library'})}
            />
          </Link>
          <FormControl variant="standard" className="typeOfServiceSelect">
            <InputLabel>
              <FormattedMessage id="common.typeOfService" />
            </InputLabel>
            <Select
              value={typeOfService}
              label={<FormattedMessage id="common.typeOfService" />}
              onChange={handleServiceTypeChange}
            >
              <MenuItem value="isbn" className="typeOfServiceMenuItem">
                <Typography>
                  <BookIcon />
                  ISBN
                </Typography>
              </MenuItem>
              <MenuItem value="issn" className="typeOfServiceMenuItem">
                <Typography>
                  <NewspaperIcon />
                  ISSN
                </Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={'loginMenu'}>
          <div className="buttonsContainer">
            {/* Show "Welcome, User" message as well as Logout button for logged in users */}
            <div className="welcomeMessage">
              <PersonIcon />
              <FormattedMessage id="login.welcome" />
              {user?.profile?.name && user.profile.name.toUpperCase()}
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>
    </AppBar>
  );
}

export default TopNav;
