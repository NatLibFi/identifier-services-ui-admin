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

import {Typography} from '@mui/material';
import moment from 'moment';

import '/src/frontend/css/common.css';
import '/src/frontend/css/requests/isbnIsmn/request.css';

import PublicationRequestCreationModal from '/src/frontend/components/isbn-registry/subComponents/modals/PublicationRequestCreationModal.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TabComponent from '/src/frontend/components/common/TabComponent.jsx';

function IsbnPublicationRequestList(props) {
  const {authenticationToken, history, setSnackbarMessage} = props;

  // Search body
  const initialSearchBody = history.location?.state?.searchBody ?? {
    searchText: '',
    limit: 10,
    offset: 0,
    state: 'NEW'
  };

  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialSearchBody);

  // Filter
  const [filterValue, setFilterValue] = useState(initialSearchBody.state ?? 'all');

  // Empty search state from history object after its use
  useEffect(() => {
    if (history?.location?.state?.searchBody) {
      history.replace({state: {}});
    }
  }, []);

  // Data fetching
  const {data, loading, error} = useSearch({
    url: '/api/isbn-registry/requests/publications/query',
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
    const redirectRoute = `/isbn-registry/requests/publications/${id}`;
    const redirectState = {searchBody};

    history.push(redirectRoute, redirectState);
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  function updateSearchText(searchText) {
    updateSearchBody({searchText, offset: 0});
  }

  function updateStateFilter(_event, state) {
    setFilterValue(state);

    // if state is all, the parameter should not be sent as part of request
    if (state && state !== 'all') {
      updateSearchBody({state});
      return;
    }

    updateSearchBody({state: undefined});
    return;
  }

  // Formatting the data to be displayed in the table
  function formatSearchResult(item) {
    const {id, title, officialName, langCode, publicationType, created, comments} = item;
    return {
      id,
      title,
      officialName,
      langCode,
      publicationType,
      created: moment(created).isValid() ? moment(created).format('LLL') : created,
      comments
    };
  }

  const headRows = [
    {id: 'title', intlId: 'form.common.title'},
    {id: 'officialName', intlId: 'common.publisher.isbn'},
    {id: 'langCode', intlId: 'form.common.language'},
    {id: 'publicationType', intlId: 'form.common.format'},
    {id: 'created', intlId: 'form.common.created'},
    {id: 'comments', intlId: 'form.common.additionalDetails'}
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
      return <Spinner />;
    }

    if (data.totalDoc === 0) {
      return (
        <p>
          <FormattedMessage id="common.noData" />
        </p>
      );
    }

    return (
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
        // Those are not displayed on small screens (mobile devices etc)
        unprioritizedRows={['officialName', 'comments']}
      />
    );
  }

  return (
    <div className="listSearch">
      <Typography variant="h5">
        <FormattedMessage id="request.publication.title" />
      </Typography>
      <div className="isbnIsmnRequestContainer">
        <SearchComponent
          initialValue={initialSearchBody.searchText}
          searchFunction={updateSearchText}
        />
        {/* Modal for creating new publication requests */}
        <PublicationRequestCreationModal
          authenticationToken={authenticationToken}
          setSnackbarMessage={setSnackbarMessage}
          history={history}
        />
      </div>
      <div className="tabsContainer">
        <Typography>
          <FormattedMessage id="tab.filter.state" />
        </Typography>
        <TabComponent handleChange={updateStateFilter} sortStateBy={filterValue} />
      </div>
      {dataComponent}
    </div>
  );
}

IsbnPublicationRequestList.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default IsbnPublicationRequestList;
