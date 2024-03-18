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

import React, {useEffect, useMemo, useState, useReducer} from 'react';
import {FormattedMessage} from 'react-intl';

import {useHistory} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useSearch from '/src/frontend/hooks/useSearch';

import moment from 'moment';
import {Typography} from '@mui/material';

import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import IssnRequestQuickFormModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnRequestQuickFormModal.jsx';
import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TabComponent from '/src/frontend/components/common/TabComponent.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import TableResultWrapper from '/src/frontend/components/common/TableResultWrapper.jsx';


function IssnRequestList() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();
  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  // Search body
  const initialSearchBody = history.location?.state?.searchBody ?? {
    searchText: '',
    limit: 10,
    offset: 0,
    status: 'NOT_HANDLED'
  };

  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialSearchBody);

  // Filter
  const [filterValue, setFilterValue] = useState(initialSearchBody.status ?? 'all');

  // Empty search state from history object after its use
  useEffect(() => {
    if (history?.location?.state?.searchBody) {
      history.replace({state: {}});
    }
  }, []);

  // Data fetching
  const {data, loading, error} = useSearch({
    url: '/api/issn-registry/requests/query',
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

  // Handle click on a table row and proceed to the single publication request page
  const handleTableRowClick = (id) => {
    const redirectRoute = `/issn-registry/requests/${id}`;
    const redirectState = {searchBody};

    history.push(redirectRoute, redirectState);
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  function updateSearchText(searchText) {
    updateSearchBody({searchText, offset: 0});
  }

  function updateStateFilter(_event, status) {
    setFilterValue(status);

    // If state equals to 'all', the parameter should not be sent as part of request
    if (status && status !== 'all') {
      updateSearchBody({status});
      return;
    }

    updateSearchBody({status: undefined});
    return;
  }

  // Pre-format data for the table
  function formatSearchResult(entry) {
    const {id, created, status, publisher, publicationCount, publicationCountIssn} = entry;

    return {
      id,
      publisher,
      status: status.toLowerCase(),
      publicationCount: `${publicationCountIssn} / ${publicationCount}`,
      created: moment(created).isValid() ? moment(created).format('LLL') : created
    };
  }

  async function createIssnRequest(values) {
    const result = await makeApiRequest({
      url: '/api/issn-registry/requests',
      method: 'POST',
      values,
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/issn-registry/requests'
    });

    if (!result) {
      return false;
    }
  }

  /* Titles of the columns in the table of requests */
  const headRows = [
    {id: 'id', intlId: 'table.headRows.id'},
    {id: 'publisher', intlId: 'common.publisher.issn'},
    {id: 'publicationCount', intlId: 'request.issn.amount'},
    {id: 'status', intlId: 'common.status'},
    {id: 'created', intlId: 'form.common.created'}
  ];

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="request.issn.title" />
      </Typography>
      <div className="issnQuickformContainer">
        <SearchComponent
          initialValue={initialSearchBody.searchText}
          searchFunction={updateSearchText}
        />
        <IssnRequestQuickFormModal createIssnRequest={createIssnRequest} />
      </div>
      <div className="tabsContainer">
        <Typography>
          <FormattedMessage id="tab.filter.state" />
        </Typography>
        <TabComponent
          handleChange={updateStateFilter}
          sortStateBy={filterValue}
          typeOfService="issn"
        />
      </div>
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
        />
      </TableResultWrapper>
    </div>
  );
}

export default IssnRequestList;
