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
import {FormattedMessage} from 'react-intl';
import {PropTypes} from 'prop-types';

import {AppBar, Grid} from '@mui/material';

import '/src/frontend/css/navigationBar/adminNav.css';
import MenuTabs from '/src/frontend/components/common/navbar/MenuTabs.jsx';

// TODO refactor: ISBN and ISSN navbars to one navbar that accepts routes + type as param
function IsbnNavbar({userInfo}) {
  const navbarItems = [
    {
      id: 'ISBN-home',
      label: <FormattedMessage id="menu.home" />,
      path: ''
    },
    {
      id: 'ISBN-publisherRegistry',
      label: <FormattedMessage id="menu.publisherRegistry" />,
      path: 'isbn-registry/publishers'
    },
    {
      id: 'ISBN-requests',
      label: <FormattedMessage id="common.requests" />,
      listItem: [
        {
          label: <FormattedMessage id="common.publishers.isbn" />,
          path: 'isbn-registry/requests/publishers'
        },
        {
          label: <FormattedMessage id="common.isbn-ismn-requests" />,
          path: 'isbn-registry/requests/publications'
        }
      ]
    },
    {
      id: 'ISBN-identifierRanges',
      label: <FormattedMessage id="menu.identifierRanges" />,
      listItem: [
        {
          label: <FormattedMessage id="common.isbn" />,
          path: 'isbn-registry/ranges/isbn'
        },
        {
          label: <FormattedMessage id="common.ismn" />,
          path: 'isbn-registry/ranges/ismn'
        }
      ]
    },
    {
      id: 'ISBN-messages',
      label: <FormattedMessage id="menu.messages" />,
      listItem: [
        {
          label: <FormattedMessage id="menu.messageTemplates" />,
          path: 'isbn-registry/messagetemplates'
        },
        {
          label: <FormattedMessage id="menu.messages" />,
          path: 'isbn-registry/messages'
        },
        {
          label: <FormattedMessage id="menu.groupMessages" />,
          path: 'isbn-registry/groupmessages'
        }
      ]
    },
    {
      id: 'ISBN-statistics',
      label: <FormattedMessage id="common.statistics" />,
      path: 'isbn-registry/statistics'
    }
  ];

  return (
    <Grid container>
      <Grid item xs={12}>
        <AppBar position="static">
          <div className="adminMenu">
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

IsbnNavbar.propTypes = {
  userInfo: PropTypes.object.isRequired
};

export default IsbnNavbar;
