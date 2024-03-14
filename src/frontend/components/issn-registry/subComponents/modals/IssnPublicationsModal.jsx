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

import React, {useMemo, useReducer, useState} from 'react';
import PropTypes from 'prop-types';

import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';

import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import {Button, Modal, Box, Typography} from '@mui/material';

import useSearch from '/src/frontend/hooks/useSearch';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

function IssnPublicationsModal(props) {
  const {searchAttribute, searchValue, publisherName} = props;

  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)

  const initialSearchBody = {limit: 10, offset: 0, [searchAttribute]: searchValue};
  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialSearchBody);

  // State managed by custom hook
  const {data, loading, error} = useSearch({
    url: '/api/issn-registry/publications/query',
    method: 'POST',
    body: searchBody,
    dependencies: [searchBody, isModalOpen],
    prefetch: false,
    fetchOnce: false,
    requireAuth: true,
    authenticationToken,
    modalIsUsed: true,
    isModalOpen
  });

  const filteredData = useMemo(() => data.results.map(filterDataFields), [data]);

  function updateRowsPerPage(rowsPerPage) {
    updateSearchBody({limit: rowsPerPage, offset: 0});
  }

  // Handles click on a table row - view single publication details
  const handleViewSinglePublication = (id) => {
    history.push(`/issn-registry/publications/${id}`, {
      // pass request or publisher id for successful redirect after publication is deleted
      requestId: searchAttribute === 'formId' ? searchValue : null,
      publisherId: searchAttribute === 'publisherId' ? searchValue : null
    });
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  // Filters data to be shown in the table
  function filterDataFields(item) {
    const {id, issn, title, language, medium, created} = item;
    return {
      id,
      issn,
      title,
      language: language ? language.toLowerCase() : null,
      // Publication type can be empty if publication was added from single request page (via quick form)
      medium: medium ? medium.toLowerCase() : 'noValue',
      created: created ? moment(created).format('LLL') : null
    };
  }

  // Titles of the table columns
  const headRows = [
    {id: 'issn', intlId: 'common.issn'},
    {id: 'title', intlId: 'form.common.title'},
    {id: 'language', intlId: 'form.common.language'},
    {id: 'medium', intlId: 'form.issn.publicationCard.publicationMedium'},
    {id: 'created', intlId: 'form.common.created'}
  ];

  return (
    <>
      {/* Button that opens a modal */}
      <Button
        className="requestButton"
        variant="outlined"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        <FormattedMessage id="common.publications" />
      </Button>

      {/* Content of a modal component */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="modal">
          {/* Loading spinner */}
          {loading && <Spinner />}

          {/* Errors */}
          {error && <Typography>Could not fetch data due to API error</Typography>}

          {/* Content */}
          {!loading && !error && (
            <>
              <div>
                <Typography variant="h5">
                  <FormattedMessage id="common.publications" />
                </Typography>
                {searchAttribute === 'publisherId' && (
                  <Typography variant="h6">
                    <FormattedMessage id="common.publisher.issn" />: {publisherName}
                  </Typography>
                )}
                {searchAttribute === 'formId' && (
                  <Typography variant="h6">
                    <FormattedMessage id="common.request" /> ID: {searchValue}
                  </Typography>
                )}
              </div>
              <>
                <TableComponent
                  pagination
                  data={filteredData}
                  handleTableRowClick={handleViewSinglePublication}
                  headRows={headRows}
                  page={searchBody.offset !== 0 ? searchBody.offset / searchBody.limit : 0}
                  setPage={updatePageNumber}
                  totalDoc={data.totalDoc}
                  rowsPerPage={searchBody.limit}
                  setRowsPerPage={updateRowsPerPage}
                />
              </>
            </>)}
        </Box>
      </Modal>
    </>
  );
}

IssnPublicationsModal.propTypes = {
  searchValue: PropTypes.number.isRequired,
  searchAttribute: PropTypes.string.isRequired,
  publisherName: PropTypes.string
};

export default IssnPublicationsModal;
