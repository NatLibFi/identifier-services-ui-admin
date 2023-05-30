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
import {PropTypes} from 'prop-types';
import {FormattedMessage} from 'react-intl';
import {AppBar, Grid} from '@mui/material';

import '/src/frontend/css/navigationBar/adminNav.css';
import MenuTabs from '/src/frontend/components/common/navbar/MenuTabs.jsx';

function IssnNavbar({userInfo}) {
  const navbarItems = [
    {
      id: 'ISSN-home',
      label: <FormattedMessage id="menu.home" />,
      path: ''
    },
    {
      id: 'ISSN-requests',
      label: <FormattedMessage id="common.requests" />,
      path: 'issn-registry/requests'
    },
    {
      id: 'ISSN-publishers',
      label: <FormattedMessage id="common.publishers.issn" />,
      path: 'issn-registry/publishers'
    },
    {
      id: 'ISSN-publications',
      label: <FormattedMessage id="common.publications" />,
      path: 'issn-registry/publications'
    },
    {
      id: 'ISSN-identifierRanges',
      label: <FormattedMessage id="menu.identifierRanges" />,
      path: 'issn-registry/ranges'
    },
    {
      id: 'ISSN-messages',
      label: <FormattedMessage id="menu.messages" />,
      listItem: [
        {
          label: <FormattedMessage id="menu.messageTemplates" />,
          path: 'issn-registry/messagetemplates'
        },
        {
          label: <FormattedMessage id="menu.messages" />,
          path: 'issn-registry/messages'
        }
      ]
    },
    {
      id: 'ISSN-statistics',
      label: <FormattedMessage id="common.statistics" />,
      path: 'issn-registry/statistics'
    }
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <AppBar position="static">
          <div className="adminMenu issnAdminMenu">
            {navbarItems.map((navbarItem) => (
              <MenuTabs
                key={navbarItem.id}
                navbarItem={navbarItem}
                isAuthenticated={userInfo.isAuthenticated}
              />
            ))}
          </div>
        </AppBar>
      </Grid>
    </Grid>
  );
}

IssnNavbar.propTypes = {
  userInfo: PropTypes.object.isRequired
};

export default IssnNavbar;
