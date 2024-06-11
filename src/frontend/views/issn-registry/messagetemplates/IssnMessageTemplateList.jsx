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

import React, {useMemo} from 'react';

import {useHistory} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import {FormattedMessage} from 'react-intl';

import useList from '/src/frontend/hooks/useList';

import {Button, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import '/src/frontend/css/common.css';

import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import TableResultWrapper from '/src/frontend/components/common/TableResultWrapper.jsx';

// Titles of the table columns
const headRows = [
  {id: 'name', intlId: 'table.headRows.name'},
  {id: 'subject', intlId: 'messages.subject'},
  {id: 'messageType', intlId: 'messages.messageType'},
  {id: 'language', intlId: 'form.common.language'}
];

function IssnMessageTemplateList() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const {data, loading, error} = useList({
    url: '/api/issn-registry/messagetemplates',
    method: 'GET',
    authenticationToken,
    prefetch: true,
    fetchOnce: true,
    requireAuth: true,
    modalIsUsed: false
  });

  const formattedData = useMemo(() => data.map(formatDataEntry), [data]);
  const hasData = formattedData && formattedData.length > 0;

  const handleTableRowClick = (id) => {
    history.push(`/issn-registry/messagetemplates/${id}`);
  };

  // Handles opening of the create template page
  const handleCreateNewTemplate = () => {
    history.push('/issn-registry/messagetemplates/form/create');
  };

  // Filters data to be shown in the table
  function formatDataEntry(item) {
    const {id, name, langCode, messageTypeName, subject} = item;
    return {
      id,
      name,
      subject,
      messageType: messageTypeName ?? '-',
      language: langCode
    };
  }

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="messages.templates" />
      </Typography>
      {/* Button for creating a new template (opens in the same tab) */}
      <Button
        variant="outlined"
        color="primary"
        className="createNewTemplateButton"
        onClick={handleCreateNewTemplate}
      >
        <AddIcon />
        <FormattedMessage id="messages.templates.create" />
      </Button>
      <TableResultWrapper error={error} loading={loading} hasData={hasData}>
        <TableComponent
          data={formattedData}
          handleTableRowClick={handleTableRowClick}
          headRows={headRows}
        />
      </TableResultWrapper>
    </div>
  );
}

export default IssnMessageTemplateList;
