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

import React, {useEffect, useReducer} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Typography} from '@mui/material';
import moment from 'moment';

import useSearch from '/src/frontend/hooks/useSearch';
import '/src/frontend/css/common.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';

function IssnMessageList(props) {
  const {authenticationToken, history} = props;

  // Component state
  const initialSearchBody = history.location?.state?.searchBody ?? {
    searchText: '',
    limit: 10,
    offset: 0
  };

  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialSearchBody);

  // Empty search state from history object after its use
  useEffect(() => {
    if (history?.location?.state?.searchBody) {
      history.replace({state: {}});
    }
  }, []);

  // Data fetching
  const {data, loading, error} = useSearch({
    url: '/api/issn-registry/messages/query',
    method: 'POST',
    body: searchBody,
    dependencies: [searchBody],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true,
    authenticationToken
  });

  function updateRowsPerPage(rowsPerPage) {
    updateSearchBody({limit: rowsPerPage, offset: 0});
  }

  const handleTableRowClick = (id) => {
    const redirectRoute = `/issn-registry/messages/${id}`;
    const redirectState = {searchBody};

    history.push(redirectRoute, redirectState);
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  // Updates search text
  function updateSearchText(searchText) {
    updateSearchBody({searchText, offset: 0});
  }

  // Titles of the table columns
  const headRows = [
    {id: 'email', intlId: 'messages.recipient'},
    {id: 'subject', intlId: 'messages.subject'},
    {id: 'messageTemplate', intlId: 'messages.messageTemplate'},
    {id: 'date', intlId: 'messages.sent'}
  ];

  // Filters data to be shown in the table
  function formatSearchResult(item) {
    const {id, recipient, subject, messageTemplateName, sent} = item;
    return {
      id,
      email: recipient,
      subject,
      messageTemplate: messageTemplateName ?? '-',
      date: moment(sent).format('LLL')
    };
  }

  const dataComponent = setDataComponent();

  function setDataComponent() {
    if (error) {
      return (
        <Typography variant="h2" className="normalTitle">
          <FormattedMessage id="errorPage.message.defaultError" />
        </Typography>
      );
    }

    if (loading) {
      return <Spinner />;
    }

    if (data.totalDoc === 0) {
      return (
        <p>
          <FormattedMessage id="common.noData" />
        </p>
      );
    }

    return(
      <TableComponent
        pagination
        data={data.results.map(formatSearchResult)}
        handleTableRowClick={handleTableRowClick}
        headRows={headRows}
        page={searchBody.offset !== 0 ? searchBody.offset / searchBody.limit : 0}
        setPage={updatePageNumber}
        totalDoc={data.totalDoc}
        rowsPerPage={searchBody.limit}
        setRowsPerPage={updateRowsPerPage}
      />
    );
  }

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="messages.sentMessages" />
      </Typography>
      <SearchComponent
        initialValue={initialSearchBody.searchText}
        searchFunction={updateSearchText}
      />
      {dataComponent}
    </div>
  );
}

IssnMessageList.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default IssnMessageList;
