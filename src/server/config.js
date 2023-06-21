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

import {readEnvironmentVariable} from '@natlibfi/melinda-backend-commons';
import {parseBoolean} from './utils';

export const API_HOST = readEnvironmentVariable('API_HOST', {defaultValue: 'https://localhost:8081'});
export const API_PATH_PREFIX = readEnvironmentVariable('API_PATH_PREFIX', {defaultValue: ''});
export const API_KEY = readEnvironmentVariable('API_KEY', {defaultValue: ''});
export const ALLOW_SELF_SIGNED = readEnvironmentVariable('ALLOW_SELF_SIGNED', {defaultValue: false, format: parseBoolean});

export const HTTP_PORT = readEnvironmentVariable('HTTP_PORT', {defaultValue: 8080, format: v => Number(v)});
export const HTTPS_PORT = readEnvironmentVariable('HTTPS_PORT', {defaultValue: 8080, format: v => Number(v)});

export const TLS_KEY = readEnvironmentVariable('TLS_KEY', {defaultValue: ''});
export const TLS_CERT = readEnvironmentVariable('TLS_CERT', {defaultValue: ''});

export const NODE_ENV = readEnvironmentVariable('NODE_ENV', {defaultValue: 'development'});

export const MAINTENANCE_MODE = readEnvironmentVariable('MAINTENANCE_MODE', {defaultValue: true, format: parseBoolean});

export const HELMET_CONFIG = readEnvironmentVariable('HELMET_CONFIG', {defaultValue: {}, format: JSON.parse});

export const OIDC_AUTHORITY = readEnvironmentVariable('OIDC_AUTHORITY', {defaultValue: ''});
export const OIDC_CLIENT_ID = readEnvironmentVariable('OIDC_CLIENT_ID', {defaultValue: ''});
export const OIDC_POST_LOGOUT_REDIRECT_URI = readEnvironmentVariable('OIDC_POST_LOGOUT_REDIRECT_URI', {defaultValue: 'https://localhost:8080'});
