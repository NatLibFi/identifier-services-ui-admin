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
import {Route} from 'react-router-dom';

import PrivateRoute from './PrivateRoute.jsx';

function CustomRoute({routeDefinition, isPrivate, props}) {
  if (isPrivate) {
    return (
      <Route
        key={routeDefinition.path}
        exact
        path={routeDefinition.path}
        render={() => (
          <PrivateRoute RenderComponent={routeDefinition.component} {...props} />
        )}
      />
    );
  }

  return (
    <Route
      key={routeDefinition.path}
      exact
      path={routeDefinition.path}
      render={() => <routeDefinition.component {...props} />}
    />
  );
}

CustomRoute.propTypes = {
  routeDefinition: PropTypes.object.isRequired,
  isPrivate: PropTypes.bool.isRequired,
  props: PropTypes.object
};

export default CustomRoute;
