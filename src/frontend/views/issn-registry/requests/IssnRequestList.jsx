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

import React, {useEffect, useState, useReducer} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import {Typography} from '@mui/material';

import useSearch from '/src/frontend/hooks/useSearch';
import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TabComponent from '/src/frontend/components/common/TabComponent.jsx';
import IssnRequestQuickFormModal from '/src/frontend/components/issn-registry/subComponents/modals/IssnRequestQuickFormModal.jsx';

function IssnRequestList(props) {
  const {authenticationToken, history, setSnackbarMessage} = props;

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
  function formatData(entry) {
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

  const dataComponent = setDataComponent();

  function setDataComponent() {
    if (error) {
      return  (
        <Typography variant="h2" className="normalTitle">
          <FormattedMessage id="errorPage.message.defaultError" />
        </Typography>
      );
    }

    if (loading) {
    /* Showing a spinner while the component is loading */
      return <Spinner />;
    }

    if (data.totalDoc === 0) {
    /* Showing a message when the list is empty */
      return (
        <p>
          <FormattedMessage id="common.noData" />
        </p>
      );
    }

    return (
      <TableComponent
        pagination
        data={data.results.map(formatData)}
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
      {dataComponent}
    </div>
  );
}

IssnRequestList.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default IssnRequestList;
