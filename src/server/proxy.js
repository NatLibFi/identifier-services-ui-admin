import httpProxy from 'express-http-proxy';

import * as config from './config';

/**
 * Getter for configured http proxy
 * @returns httpProxy from express-http-proxy configured with environmental values
 */
export function getConfiguredProxy() {
  return httpProxy(config.API_HOST, createProxyOpts());
}

function createProxyOpts() {
  const proxyOpts = {};

  proxyOpts.proxyReqOptDecorator = preprocessRequest;
  proxyOpts.proxyReqPathResolver = appendPrefixToPath;
  proxyOpts.https = config.API_HOST.startsWith('https://');
  proxyOpts.filter = filterRequest;

  return proxyOpts;
}

// Disallow proxy during maintenance
// eslint-disable-next-line no-unused-vars
function filterRequest(_req, _res) {
  if(config.MAINTENANCE_MODE) {
    return false;
  }

  return true;
}

// Append the prefix to path if it's defined in env
function appendPrefixToPath(req) {
  return config.API_PATH_PREFIX ? `${config.API_PATH_PREFIX}${req.url}` : req.url;
}

// Set decorator options based on the environment configuration
function preprocessRequest(proxyReqOpts, srcReq) {
  // For development purposes only
  if(config.ALLOW_SELF_SIGNED) {
    proxyReqOpts.rejectUnauthorized = false;
  }

  if(config.API_CLIENT_CERTIFICATE_KEY && config.API_CLIENT_CERTIFICATE_CERT) {
    proxyReqOpts.key = config.API_CLIENT_CERTIFICATE_KEY;
    proxyReqOpts.cert = config.API_CLIENT_CERTIFICATE_CERT;
  }

  if(config.API_KEY) {
    proxyReqOpts.headers['X-Api-Key'] = config.API_KEY;
  }

  if(config.PROXY_IP_SRC_HEADER && config.PROXY_CUSTOM_HEADER && config.PROXY_CUSTOM_HEADER.startsWith('x-')) {
    proxyReqOpts.headers[config.PROXY_CUSTOM_HEADER] = srcReq.headers[config.PROXY_IP_SRC_HEADER];
  }

  return proxyReqOpts;
}
