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
import {PropTypes} from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Snackbar, IconButton, Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CustomizedSnackbar({message, setMessage}) {
  const [open, setOpen] = useState(Boolean(message));

  useEffect(() => {
    setOpen(true);
  }, [message]);

  function handleClose() {
    setOpen(false);
    setMessage(null);
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        aria-describedby="client-snackbar"
        severity={message.severity ?? 'warning'}
        variant="filled"
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      >
        {message.intlId && <FormattedMessage id={message.intlId} />}
        {message.message && message.message}
      </Alert>
    </Snackbar>
  );
}

CustomizedSnackbar.propTypes = {
  message: PropTypes.object,
  setMessage: PropTypes.func.isRequired
};

export default CustomizedSnackbar;
