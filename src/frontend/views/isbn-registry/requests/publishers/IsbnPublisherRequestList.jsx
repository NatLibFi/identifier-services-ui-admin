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

import React, {useEffect, useMemo, useReducer} from 'react';
import {FormattedMessage} from 'react-intl';

import {useHistory} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import useSearch from '/src/frontend/hooks/useSearch';

import {Typography} from '@mui/material';
import moment from 'moment';

import '/src/frontend/css/common.css';

import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import TableResultWrapper from '/src/frontend/components/common/TableResultWrapper.jsx';

import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';

function IsbnPublisherRequestList() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

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
    url: '/api/isbn-registry/requests/publishers/query',
    method: 'POST',
    body: searchBody,
    dependencies: [searchBody],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true,
    authenticationToken
  });

  const formattedData = useMemo(() => data.results.map(formatSearchResult), [data]);
  const hasData = formattedData && formattedData.length > 0;

  function updateRowsPerPage(rowsPerPage) {
    updateSearchBody({limit: rowsPerPage, offset: 0});
  }

  const handleTableRowClick = (id) => {
    const redirectRoute = `/isbn-registry/requests/publishers/${id}`;
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

  // Formatting the data to be displayed in the table
  function formatSearchResult(item) {
    const {id, officialName, email, langCode, created, additionalInfo} = item;
    return {
      id,
      officialName,
      email,
      langCode,
      additionalInfo,
      created: moment(created).isValid() ? moment(created).format('LLL') : created
    };
  }

  const headRows = [
    {id: 'officialName', intlId: 'form.common.name'},
    {id: 'email', intlId: 'form.common.email'},
    {id: 'langCode', intlId: 'form.common.language'},
    {id: 'created', intlId: 'form.common.created'},
    {id: 'additionalInfo', intlId: 'form.common.additionalDetails'}
  ];

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="request.publisher.title" />
      </Typography>
      <SearchComponent
        initialValue={initialSearchBody.searchText}
        searchFunction={updateSearchText}
      />
      <TableResultWrapper error={error} loading={loading} hasData={hasData}>
        <TableComponent
          pagination
          data={formattedData}
          handleTableRowClick={handleTableRowClick}
          headRows={headRows}
          page={searchBody.offset !== 0 ? searchBody.offset / searchBody.limit : 0}
          setPage={updatePageNumber}
          totalDoc={data.totalDoc}
          rowsPerPage={searchBody.limit}
          setRowsPerPage={updateRowsPerPage}
          // Those are not displayed on small screens (mobile devices etc)
          unprioritizedRows={['email', 'additionalInfo']}
        />
      </TableResultWrapper>

    </div>
  );
}

export default IsbnPublisherRequestList;
