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

import useSearch from '/src/frontend/hooks/useSearch';

import moment from 'moment';
import {Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TabComponent from '/src/frontend/components/common/TabComponent.jsx';

function IssnPublicationList(props) {
  const {authenticationToken, history} = props;

  // Search body
  const initialSearchBody = history.location.state?.searchBody ?? {
    searchText: '',
    limit: 10,
    offset: 0,
    status: 'NO_PREPUBLICATION_RECORD'
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
    url: '/api/issn-registry/publications/query',
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
    const redirectRoute = `/issn-registry/publications/${id}`;
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

    // if state is all, the parameter should not be sent as part of request
    if (status && status !== 'all') {
      updateSearchBody({status});
      return;
    }

    updateSearchBody({status: undefined});
    return;
  }

  // Formats the data to be displayed in the table
  function formatData(entry) {
    const {id, issn, title, language, medium, status, created} = entry;

    return {
      id,
      issn,
      title,
      status: status.toLowerCase(),
      created: moment(created).isValid() ? moment(created).format('LLL') : created,
      language: language.toLowerCase(),
      medium: medium.toLowerCase()
    };
  }

  /* Titles of the columns in the table of publications */
  const headRows = [
    {id: 'id', intlId: 'common.id'},
    {id: 'issn', intlId: 'common.issn'},
    {id: 'title', intlId: 'common.publication'},
    {id: 'language', intlId: 'form.common.language'},
    {id: 'medium', intlId: 'form.common.format'},
    {id: 'status', intlId: 'common.status'},
    {id: 'created', intlId: 'form.common.created'}
  ];

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
        // Those are not displayed on small screens (mobile devices etc)
        // screen < 900px
        unprioritizedRows={['medium']}
        // screen < 550px
        unprioritizedMobileRows={['language']}
      />
    );
  }

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="publication.issn.title" />
      </Typography>
      <SearchComponent
        initialValue={initialSearchBody.searchText}
        searchFunction={updateSearchText}
      />
      <div className="issnTabsRow">
        <TabComponent
          issnPublications
          handleChange={updateStateFilter}
          sortStateBy={filterValue}
        />
      </div>
      {dataComponent}
    </div>
  );
}

IssnPublicationList.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired
};

export default IssnPublicationList;
