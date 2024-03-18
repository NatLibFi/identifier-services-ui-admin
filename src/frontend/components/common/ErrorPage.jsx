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

import {Typography, Paper} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import '/src/frontend/css/errorPage.css';

function ErrorPage({errorMessage}) {
  // Set the title of the current page
  document.title = 'Virhesivu';
  const errorToDisplay = errorMessage || '';

  return (
    <Paper elevation={2} className="errorContainer">
      <Typography variant="h4" className="errorHeader">
        <ErrorIcon fontSize="inherit" />
        <p>Järjestelmä on kohdannut virheen</p>
      </Typography>
      <Typography variant="body1" className="errorText">
        {errorToDisplay}
      </Typography>
    </Paper>
  );
}

ErrorPage.propTypes = {
  errorMessage: PropTypes.string
};

export default ErrorPage;
