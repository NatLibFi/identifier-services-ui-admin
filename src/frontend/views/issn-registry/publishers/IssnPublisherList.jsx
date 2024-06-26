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

import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';

import {FormattedMessage} from 'react-intl';
import {Typography} from '@mui/material';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useSearch from '/src/frontend/hooks/useSearch';
import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/common.css';

import IssnPublisherQuickFormModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnPublisherQuickFormModal.jsx';
import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import TableResultWrapper from '/src/frontend/components/common/TableResultWrapper.jsx';

function IssnPublisherList() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  // Search body
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
    url: '/api/issn-registry/publishers/query',
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
    const redirectRoute = `/issn-registry/publishers/${id}`;
    const redirectState = {searchBody};

    history.push(redirectRoute, redirectState);
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  function updateSearchText(searchText) {
    updateSearchBody({searchText, offset: 0});
  }

  function formatSearchResult(entry) {
    const {id, officialName, emailCommon, phone, langCode} = entry;

    return {
      id,
      officialName,
      emailCommon,
      phone,
      langCode
    };
  }

  async function createIssnPublisher(values) {
    const result = await makeApiRequest({
      url: '/api/issn-registry/publishers',
      method: 'POST',
      values,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      redirect(history, `/issn-registry/publishers/${result.id}`);
    }
  }

  const headRows = [
    {id: 'id', intlId: 'common.id'},
    {id: 'officialName', intlId: 'common.publisher.issn'},
    {id: 'emailCommon', intlId: 'form.common.email'},
    {id: 'phone', intlId: 'form.common.phone'},
    {id: 'langCode', intlId: 'form.common.language'}
  ];

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="publisher.issn.title" />
      </Typography>
      <div className="issnQuickformContainer">
        <SearchComponent
          initialValue={initialSearchBody.searchText}
          searchFunction={updateSearchText}
        />
        {/* Modal for creating new ISSN publishers */}
        <IssnPublisherQuickFormModal createIssnPublisher={createIssnPublisher} />
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
          // Those are not displayed on small screens (< 900px)
          unprioritizedRows={['phone']}
        />
      </TableResultWrapper>
    </div>
  );
}

export default IssnPublisherList;
