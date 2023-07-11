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
import PropTypes from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';

import {Button, Modal, Box, Typography} from '@mui/material';

import useList from '/src/frontend/hooks/useList';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

function PublisherRangePublicationListModal(props) {
  const {publisherRangeId, identifierType, history, authenticationToken} = props;

  const intl = useIntl();

  // Local state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)

  // State managed by custom hook
  const {data, loading, error} = useList({
    url: `/api/isbn-registry/publisher-ranges/${identifierType}/${publisherRangeId}/get-publications`,
    method: 'GET',
    authenticationToken,
    dependencies: [publisherRangeId, isModalOpen, authenticationToken],
    prefetch: false,
    fetchOnce: true,
    requireAuth: true,
    modalIsUsed: true,
    isModalOpen
  });

  useEffect(() => {
    if (isModalOpen) {
      setPage(0);
    }
  }, [authenticationToken, isModalOpen, rowsPerPage]);

  // Event handler for changing page in the table
  const handlePageChange = (pageIdx) => {
    setPage(pageIdx);
  };

  // Event handler for viewing a single publication
  const handleTableRowClick = (id) => {
    const redirectUrl = `/isbn-registry/requests/publications/${id}`;
    const redirectState = {
      redirectFromPublicationModal: `/isbn-registry/publisher-ranges/${identifierType}/${publisherRangeId}`
    };
    history.push(redirectUrl, redirectState);
  };

  // Titles of the table columns
  const headRows = [
    {id: 'title', intlId: 'form.common.title'},
    {id: 'language', intlId: 'form.common.language'},
    {id: 'publicationType', intlId: 'table.headRows.publicationType'},
    {id: 'identifiersPrinted', intlId: 'common.identifiersPrinted'},
    {id: 'identifiersElectronical', intlId: 'common.identifiersElectronical'}
  ];

  const component = getComponent();

  function getComponent() {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <Typography>Could not fetch data due to API error</Typography>;
    }

    return (
      <>
        <TableComponent
          pagination
          data={data
            .map((v) => filterDataFields(v, intl))
            .slice(page * rowsPerPage, (page + 1) * rowsPerPage)}
          handleTableRowClick={handleTableRowClick}
          headRows={headRows}
          page={page}
          setPage={handlePageChange}
          totalDoc={data.length}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
        />
      </>
    );
  }

  return (
    <>
      {/* Button that opens a modal */}
      <Button
        className="buttons"
        variant="outlined"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        <FormattedMessage id="common.publications" />
      </Button>

      {/* Content of a modal component */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="modal">
          <div>
            <Typography variant="h5">
              <FormattedMessage id="common.publications" />
            </Typography>
          </div>
          {component}
        </Box>
      </Modal>
    </>
  );
}

function filterDataFields(item, intl) {
  const {
    id,
    publicationIdentifierPrint,
    publicationIdentifierElectronical,
    publicationType,
    title,
    language,
    type,
    fileformat
  } = item;
  const identifiersPrinted = getIdentifiers(publicationIdentifierPrint, true).join(', ');
  const identifiersElectronical = getIdentifiers(publicationIdentifierElectronical).join(', ');

  return {
    id,
    identifiersPrinted,
    identifiersElectronical,
    publicationType,
    title,
    language: language ? language.toLowerCase() : null,
    type,
    fileformat
  };

  function getIdentifiers(identifiersJsonString, print = false) {
    try {
      if (!identifiersJsonString) {
        return [];
      }

      const parsedJson = JSON.parse(identifiersJsonString);
      return Object.keys(parsedJson).reduce(
        (prev, acc) => [
          ...prev,
          `${acc} (${translateTypeToFinnish(parsedJson[acc], print)})`
        ],
        []
      );
    } catch (err) {
      return [];
    }
  }

  function translateTypeToFinnish(term, print = false) {
    const format = print ? 'printFormat' : 'fileFormat';
    return intl.formatMessage({id: `form.${format}.${term.toLowerCase()}`});
  }
}

PublisherRangePublicationListModal.propTypes = {
  publisherRangeId: PropTypes.string.isRequired,
  identifierType: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  authenticationToken: PropTypes.string.isRequired
};

export default PublisherRangePublicationListModal;
