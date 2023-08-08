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

import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import https from 'https';
import path from 'path';

import {HELMET_CONFIG, TLS_CERT, TLS_KEY, HTTP_PORT, HTTPS_PORT} from './config';
import {provideFrontendConfig} from './utils';
import {getConfiguredProxy} from './proxy';

export default async function startApp() {
  const app = express();

  // Header config
  app.disable('x-powered-by');

  app.use(helmet(HELMET_CONFIG));

  // Parse application/json, required for turnstile auth
  app.use(bodyParser.json());

  // FE config management
  app.get('/api/config', provideFrontendConfig);

  // Proxy API calls
  app.use('/api', getConfiguredProxy());

  // Serve static files
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Fallback to index
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  });

  // Error management
  app.use(handleErrors);

  // If TLS configuration is not provided, start HTTP server
  if (!TLS_CERT || !TLS_KEY) {
    const server = app.listen(HTTP_PORT, () => console.log('info', `HTTP server started on PORT ${HTTP_PORT}`));
    return server;
  }

  // If http-server was not returned, return https-server
  const tlsConfig = {
    key: TLS_KEY,
    cert: TLS_CERT
  };

  const server = https.createServer(tlsConfig, app).listen(HTTPS_PORT, () => {
    console.log(`Started identifier-services-api https server on port ${HTTPS_PORT}`);
  });

  return server;

  function handleErrors(err, req, res, next) {
    if(err) {
      return res.status(500).json({message: 'Unknown error occurred'});
    }

    next();
  }
}
