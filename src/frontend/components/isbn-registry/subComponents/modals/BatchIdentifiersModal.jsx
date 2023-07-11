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

import React, {useState, useEffect} from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import {Button, Modal, Box, Typography} from '@mui/material';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';

function BatchIdentifiersModal({identifiers, identifierCount}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)
  const [identifiersList, setIdentifiersList] = useState([]);

  // Event handlers for the modal window (open/closed)
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Get the identifiers list for the current page
  useEffect(() => {
    if (isModalOpen) {
      setPage(0);

      setIdentifiersList(identifiers.slice(0, rowsPerPage));
    }
  }, [rowsPerPage, isModalOpen]);

  // Event handler for changing page in the table
  const handlePageChange = (pageIdx) => {
    setPage(pageIdx);
    setIdentifiersList(
      identifiers.slice(pageIdx * rowsPerPage, (pageIdx + 1) * rowsPerPage)
    );
  };

  // Event handler for clicking on row (NB does nothing at the moment)
  const handleTableRowClick = () => {};

  // Check if the publication type field has a value, if not, set it to 'not defined'
  const identifierHasType = (identifier) => {
    if (identifier.publicationType === '') {
      return {...identifier, publicationType: 'noValue'};
    }
    return identifier;
  };

  // Titles of the table columns
  const headRows = [
    {id: 'id', intlId: 'table.headRows.id'},
    {id: 'identifier', intlId: 'table.headRows.identifier'},
    {id: 'publicationType', intlId: 'table.headRows.publicationType'}
  ];

  return (
    <>
      {/* Button that opens a modal */}
      <Button variant="outlined" color="primary" onClick={handleOpenModal}>
        <FormattedMessage id="form.button.label.identifiers" />
      </Button>

      {/* Content of a modal component */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className="modal">
          <div>
            <Typography variant="h5">
              <FormattedMessage id="common.identifiers" />
            </Typography>
          </div>
          <TableComponent
            notClickable
            pagination
            data={identifiersList.map((item) => identifierHasType(item))}
            handleTableRowClick={handleTableRowClick}
            headRows={headRows}
            page={page}
            setPage={handlePageChange}
            totalDoc={identifierCount}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </Box>
      </Modal>
    </>
  );
}

BatchIdentifiersModal.propTypes = {
  identifiers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      identifier: PropTypes.string,
      publicationType: PropTypes.string
    })
  ),
  identifierCount: PropTypes.number
};

export default BatchIdentifiersModal;
