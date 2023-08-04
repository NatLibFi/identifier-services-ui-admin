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

import React, {useState, useReducer} from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import {Button, Modal, Box, Typography} from '@mui/material';

import useSearch from '/src/frontend/hooks/useSearch';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

function IsbnPublisherMessagesModal(props) {
  const {history, authenticationToken, publisher} = props;

  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)

  const initialSearchBody = {limit: 10, offset: 0, publisherId: publisher.id};
  const [searchBody, updateSearchBody] = useReducer((prev, next) => {
    return {...prev, ...next};
  }, initialSearchBody);

  // Data fetching
  const {data, loading, error} = useSearch({
    url: '/api/isbn-registry/messages/query',
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

  // Event handlers for the modal window (open/closed)
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  function updateRowsPerPage(rowsPerPage) {
    updateSearchBody({limit: rowsPerPage, offset: 0});
  }

  const handleTableRowClick = (id) => {
    history.push({
      pathname: `/isbn-registry/messages/${id}`,
      // Passes publisher id for the back button
      state: {
        publisherId: publisher.id
      }
    });
  };

  function updatePageNumber(pageIdx) {
    updateSearchBody({offset: pageIdx * searchBody.limit});
  }

  // Filters data to be shown in the table
  function filterDataFields(item) {
    const {id, recipient, subject, sent} = item;
    return {
      id,
      email: recipient,
      subject,
      date: moment(sent).format('LLL')
    };
  }

  // Titles of the table columns
  const headRows = [
    {id: 'email', intlId: 'form.common.email'},
    {id: 'subject', intlId: 'messages.subject'},
    {id: 'date', intlId: 'messages.sent'}
  ];

  let component;

  if (loading) {
    component = <Spinner />;
  } else if (error) {
    component = <Typography>Could not fetch data due to API error</Typography>;
  } else {
    component = (
      <TableComponent
        pagination
        data={data.results.map(filterDataFields)}
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
    <>
      {/* Button that opens a modal */}
      <Button
        className="buttons"
        variant="outlined"
        color="primary"
        onClick={handleOpenModal}
      >
        <FormattedMessage id="menu.messages" />
      </Button>

      {/* Content of a modal component */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className="modal">
          <div>
            <Typography variant="h5">
              <FormattedMessage id="messages.history" />
            </Typography>
            <Typography variant="h6">
              <FormattedMessage id="common.publisher.isbn" />: {publisher.officialName}
            </Typography>
          </div>
          {component}
        </Box>
      </Modal>
    </>
  );
}

IsbnPublisherMessagesModal.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  publisher: PropTypes.object.isRequired
};

export default IsbnPublisherMessagesModal;
