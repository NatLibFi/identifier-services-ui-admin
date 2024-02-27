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

import useSearch from '/src/frontend/hooks/useSearch';

import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Tooltip,
  Switch
} from '@mui/material';

import {
  MenuBook,
  MusicNote,
  HourglassEmpty
} from '@mui/icons-material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/publishers/adminSearch.css';

import SearchComponent from '/src/frontend/components/common/SearchComponent.jsx';
import TableResultWrapper from '/src/frontend/components/common/TableResultWrapper.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';

function IsbnPublisherList() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  // Component state
  const initialSearchBody = history.location?.state?.searchBody ?? {
    searchText: '',
    limit: 10,
    offset: 0,
    category: undefined,
    identifierType: undefined
  };

  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialSearchBody);

  function getInitialCategoryFilterValue(history) {
    if (
      !history?.location?.state?.searchBody?.category ||
      !history?.location?.state?.searchBody?.identifierType
    ) {
      return '';
    }

    const category = history.location.state.searchBody.category;
    const identifierType = history.location.state.searchBody.identifierType;

    return `${category}-${identifierType}`;
  }

  // Returns initial state for filter from history if it exists
  // Returns null in case history does not have value defined in state
  function getInitialFilterState(filterName, history) {
    return history?.location?.state?.searchBody?.[filterName] || null;
  }

  const [categoryFilterValue, setCategoryFilterValue] = useState(getInitialCategoryFilterValue(history));
  const [hasQuittedFilter, setHasQuittedFilter] = useState(getInitialFilterState('hasQuitted', history) ?? false);
  const [identifierTypeFilter, setIdentifierTypeFilter] = useState(getInitialFilterState('identifierType', history) ?? 'ISBN');

  // Empty search state from history object after its use
  useEffect(() => {
    if (history?.location?.state?.searchBody) {
      history.replace({state: {}});
    }
  }, []);

  // Data fetching
  const {data, loading, error} = useSearch({
    url: '/api/isbn-registry/publishers/query',
    method: 'POST',
    body: searchBody,
    dependencies: [searchBody],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true,
    authenticationToken
  });

  const formattedData = useMemo(() => data?.results.map(formatSearchResult), [data]);
  const hasData = formattedData && formattedData.length > 0;

  function updateRowsPerPage(rowsPerPage) {
    updateSearchBody({limit: rowsPerPage, offset: 0});
  }

  const handleTableRowClick = (id) => {
    const redirectRoute = `/isbn-registry/publishers/${id}`;
    const redirectState = {searchBody};

    history.push(redirectRoute, redirectState);
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  function updateSearchText(searchText) {
    updateSearchBody({searchText, offset: 0});
  }

  function updateCategoryFilter(event) {
    const categoryFilterValue = event.target.value;
    setCategoryFilterValue(categoryFilterValue);

    if (categoryFilterValue !== '') {
      const newIdentifierType = categoryFilterValue.substring(2);
      updateSearchBody({
        category: Number(categoryFilterValue.substring(0, 1)),
        identifierType: newIdentifierType
      });

      setIdentifierTypeFilter(newIdentifierType);
      return;
    }

    // Set filters to defaults
    setIdentifierTypeFilter('ISBN');
    updateSearchBody({category: undefined, identifierType: 'ISBN'});
    return;
  }

  function handleHasQuittedFilterChange() {
    updateSearchBody({hasQuitted: !hasQuittedFilter});
    setHasQuittedFilter(!hasQuittedFilter);
  }

  function handleIdentifierTypeFilterChange() {
    const newFilterValue = identifierTypeFilter === 'ISBN' ? 'ISMN' : 'ISBN';
    updateSearchBody({identifierType: newFilterValue});
    setIdentifierTypeFilter(newFilterValue);
  }

  // Get the icon for the publisher type - book, music, both or none
  function getPublisherTypeIcon({activeIdentifierIsbn, activeIdentifierIsmn}) {
    // If parameters are undefined - return no icon
    if (activeIdentifierIsbn === undefined && activeIdentifierIsmn === undefined) {
      return '';
    }

    // Publishers with both ISBN and ISMN active identifiers
    if (activeIdentifierIsbn && activeIdentifierIsmn) {
      return (
        <Tooltip title={<FormattedMessage id="common.isbn-ismn" />}>
          <div className="bothPublicationTypes">
            <span>
              <MenuBook />
            </span>
            <span>
              <MusicNote />
            </span>
          </div>
        </Tooltip>
      );
    }

    // Publishers with only ISBN active identifier
    if (activeIdentifierIsbn) {
      return (
        <Tooltip title={<FormattedMessage id="common.isbn" />}>
          <MenuBook />
        </Tooltip>
      );
    }

    // Publishers with only ISMN active identifier
    if (activeIdentifierIsmn) {
      return (
        <Tooltip title={<FormattedMessage id="common.ismn" />}>
          <MusicNote />
        </Tooltip>
      );
    }

    // Publishers with no active identifiers
    return (
      <Tooltip title={<FormattedMessage id="common.noActiveIdentifiers" />}>
        <HourglassEmpty />
      </Tooltip>
    );
  }

  // Formatting the data to be displayed in the table
  function formatSearchResult(item) {
    const {
      id,
      officialName,
      email,
      otherNames,
      hasQuitted,
      activeIdentifierIsbn,
      activeIdentifierIsmn,
      contactPerson
    } = item;
    return {
      id,
      type: getPublisherTypeIcon({activeIdentifierIsbn, activeIdentifierIsmn}),
      name: officialName,
      otherNames,
      email,
      contactPerson,
      isActive: !hasQuitted,
      activeIdentifiers: [{isbn: activeIdentifierIsbn}, {ismn: activeIdentifierIsmn}]
    };
  }

  const headRows = [
    {id: 'type', intlId: 'form.common.type'},
    {id: 'name', intlId: 'form.common.name'},
    {id: 'otherNames', intlId: 'form.common.otherNames'},
    {id: 'email', intlId: 'form.common.email'},
    {id: 'contactPerson', intlId: 'form.common.contactPerson'},
    {id: 'isActive', intlId: 'table.headRows.active'},
    {id: 'activeIdentifiers', intlId: 'publisherRegistry.headRows.activeIdentifiers'}
  ];

  return (
    <div className="listSearch">
      <InputLabel htmlFor="search-input">
        <Typography variant="h2" className="normalTitle">
          <FormattedMessage id="publisherRegistry.title" />
        </Typography>
      </InputLabel>
      <div className="listSearchBoxFilters">
        <div className="searchInput">
          <SearchComponent
            initialValue={initialSearchBody.searchText}
            searchFunction={updateSearchText}
          />
        </div>
        {/* hasQuitted filter */}
        <div className="hasQuittedSwitch">
          <Typography
            data-checked={hasQuittedFilter}
          >
            <FormattedMessage id="publisherRegistry.search.hasQuitted.true" />
          </Typography>
          <Switch
            label="switch between hasQuitted filter"
            checked={!hasQuittedFilter}
            onChange={handleHasQuittedFilterChange}
            inputProps={{'aria-label': 'controlled switch'}}
          />
          <Typography
            data-checked={!hasQuittedFilter}
          >
            <FormattedMessage id="publisherRegistry.search.hasQuitted.false" />
          </Typography>
        </div>

        {/* identifierType filter */}
        <div className="identifierTypeSwitch">
          <Typography
            data-checked={identifierTypeFilter === 'ISBN'}
          >
            <FormattedMessage id="common.isbn" />
          </Typography>
          <Switch
            label="switch between identifierType filter"
            checked={identifierTypeFilter === 'ISMN'}
            onChange={handleIdentifierTypeFilterChange}
            inputProps={{'aria-label': 'controlled switch'}}
          />
          <Typography
            data-checked={identifierTypeFilter === 'ISMN'}
          >
            <FormattedMessage id="common.ismn" />
          </Typography>
        </div>
      </div>
      {/* Category filter */}
      <FormControl className="categoryFilterContainer">
        <InputLabel id="filter-by-category">
          <FormattedMessage id="publisherRegistry.filterByRangeCategory" />
        </InputLabel>

        <Select
          labelId="filter-by-category"
          value={categoryFilterValue}
          label={<FormattedMessage id="publisherRegistry.filterByRangeCategory" />}
          onChange={updateCategoryFilter}
        >
          <MenuItem value={''}>
            <em>
              <FormattedMessage id="common.blank" />
            </em>
          </MenuItem>
          <ListSubheader>ISBN</ListSubheader>
          <MenuItem value="1-ISBN">1</MenuItem>
          <MenuItem value="2-ISBN">2</MenuItem>
          <MenuItem value="3-ISBN">3</MenuItem>
          <MenuItem value="4-ISBN">4</MenuItem>
          <MenuItem value="5-ISBN">5</MenuItem>
          <ListSubheader>ISMN</ListSubheader>
          <MenuItem value="3-ISMN">3</MenuItem>
          <MenuItem value="5-ISMN">5</MenuItem>
          <MenuItem value="6-ISMN">6</MenuItem>
          <MenuItem value="7-ISMN">7</MenuItem>
        </Select>
      </FormControl>
      {/* Data component */}
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
          // screen < 900px
          unprioritizedRows={['email', 'contactPerson']}
          // screen < 550px
          unprioritizedMobileRows={['type']}
        />
      </TableResultWrapper>
    </div>
  );
}

export default IsbnPublisherList;
