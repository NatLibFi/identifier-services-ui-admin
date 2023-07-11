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

import fs from 'fs';
import HttpStatus from 'http-status';

import * as config from './config';

export function provideFrontendConfig(_, res) {
  const frontendConfig = {
    environment: config.NODE_ENV,
    maintenance: config.MAINTENANCE_MODE,
    oidcConfig: {
      authority: config.OIDC_AUTHORITY,
      client_id: config.OIDC_CLIENT_ID,
      post_logout_redirect_uri: config.OIDC_POST_LOGOUT_REDIRECT_URI
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

export function parseFile(path) {
  if(fs.existsSync(path)) {
    return fs.readFileSync(path, 'utf8');
  }

  throw new Error(`Could not read file from path ${path}`);
}
