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

import HttpStatus from 'http-status';

import {NODE_ENV,
  OIDC_AUTHORITY, OIDC_CLIENT_ID, OIDC_POST_LOGOUT_REDIRECT_URI, MAINTENANCE_MODE} from './config';

export function provideFrontendConfig(_, res) {
  const frontendConfig = {
    environment: NODE_ENV,
    maintenance: MAINTENANCE_MODE,
    oidcConfig: {
      authority: OIDC_AUTHORITY,
      client_id: OIDC_CLIENT_ID,
      post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI
    }
  };

  return res.status(HttpStatus.OK).json(frontendConfig);
}

export function parseBoolean(value) {
  if (value === undefined) {
    return false;
  }

  if (Number.isNaN(Number(value))) {
    return value.length > 0 && !(/^(?:false)$/ui).test(value);
  }

  return Boolean(Number(value));
}
