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

import {Grid} from '@mui/material';

import useAppState from '/src/frontend/hooks/useAppState';

import IsbnNavbar from '/src/frontend/components/common/navbar/IsbnNavbar.jsx'; // teal ISBN nav bar
import IssnNavbar from '/src/frontend/components/common/navbar/IssnNavbar.jsx'; // green ISSN nav bar

import '/src/frontend/css/navigationBar/defaultNav.css';

function MainNav() {
  const {typeOfService} = useAppState();

  return (
    <Grid container item xs={12}>
      {typeOfService === 'issn' ? (
        <IssnNavbar />
      ) : (
        <IsbnNavbar />
      )}
    </Grid>
  );
}

export default MainNav;
