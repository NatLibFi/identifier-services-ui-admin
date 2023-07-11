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
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Typography, Paper} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import useDocumentTitle from '/src/frontend/hooks/useDocumentTitle';
import '/src/frontend/css/errorPage.css';

function ErrorPage({errorType, errorMessage, location}) {
  // Set the title of the current page
  useDocumentTitle('common.errorPage');

  const generatedErrorMessage = () => {
    if (errorType === 'SERVICE_DOWN') {
      return (<FormattedMessage id="errorPage.message.serviceDown" />);
    }

    if (errorType === 'SERVICE_UNDER_MAINTENANCE') {
      return (<FormattedMessage id="errorPage.message.serviceUnderMaintenance" />);
    }

    return (<FormattedMessage id="errorPage.message.defaultError" />);
  };

  const errorMessageToDisplay = () => {
    const message = location?.state?.errorMessage || errorMessage;
    return message ? <FormattedMessage id={message} /> : generatedErrorMessage();
  };

  return (
    <Paper elevation={2} className="errorContainer">
      <Typography variant="h4" className="errorHeader">
        <ErrorIcon fontSize="inherit" />
        <FormattedMessage id="errorPage.header" />
      </Typography>
      <Typography variant="body1" className="errorText">
        {errorMessageToDisplay()}
      </Typography>
    </Paper>
  );
}

ErrorPage.propTypes = {
  errorType: PropTypes.string,
  errorMessage: PropTypes.any,
  location: PropTypes.object
};

export default ErrorPage;
