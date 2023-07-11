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
import {Field} from 'react-final-form';
import PropTypes from 'prop-types';

import {Grid} from '@mui/material';

import RenderMultiSelect from './RenderMultiSelect.jsx';

function RenderOtherAndPreviousNames({fieldName}) {
  return (
    <Grid item xs={12}>
      <Field
        className="selectField full"
        component={(props) => <RenderMultiSelect {...props} />}
        name={fieldName}
        type="multiSelect"
        // Options are set to an empty array since they are required for component functionality but not needed otherwise
        options={[]}
        isMulti={true}
      />
    </Grid>
  );
}

RenderOtherAndPreviousNames.propTypes = {
  fieldName: PropTypes.string.isRequired
};

export default RenderOtherAndPreviousNames;
