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
import {FormattedMessage} from 'react-intl';

import {useAuth} from 'react-oidc-context';

import {Typography, Button} from '@mui/material';
import LogOutIcon from '@mui/icons-material/Logout';

import '/src/frontend/css/logout.css';

function LogoutButton() {
  const auth = useAuth();

  const handleLogOut = () => {
    auth.removeUser();
    auth.signoutRedirect({id_token_hint: auth.user?.id_token});
  };

  return (
    <Button className="logoutButton" color="inherit" onClick={handleLogOut}>
      <LogOutIcon fontSize="medium" />
      <Typography variant="body2">
        <FormattedMessage id="login.button.title.logout" />
      </Typography>
    </Button>
  );
}

export default LogoutButton;
