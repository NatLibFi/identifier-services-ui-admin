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
import {FormattedMessage} from 'react-intl';

import {Snackbar, IconButton, Alert} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import useAppState from '/src/frontend/hooks/useAppState';
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';


function CustomizedSnackbar() {
  const {snackbarMessage} = useAppState();
  const appStateDispatch = useAppStateDispatch();

  const [open, setOpen] = useState(Boolean(snackbarMessage));

  useEffect(() => {
    setOpen(true);
  }, [snackbarMessage]);

  function handleClose() {
    setOpen(false);
    appStateDispatch({snackbarMessage: null});
  }

  if (!snackbarMessage) {
    return;
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
        severity={snackbarMessage?.severity ?? 'warning'}
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
        {snackbarMessage.intlId && <FormattedMessage id={snackbarMessage.intlId} />}
        {snackbarMessage.message && snackbarMessage.message}
      </Alert>
    </Snackbar>
  );
}

export default CustomizedSnackbar;
