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

import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import {Modal, Box, Typography, TablePagination, Button} from '@mui/material';

import '/src/frontend/css/subComponents/modals.css';
import useList from '/src/frontend/hooks/useList';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

function MarcPreviewModal({url, method, buttonLabelId, authenticationToken}) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)
  const [page, setPage] = useState(0);

  const {data, loading, error} = useList({
    url,
    method,
    authenticationToken,
    dependencies: [isModalOpen],
    prefetch: false,
    fetchOnce: false,
    requireAuth: true,
    modalIsUsed: true,
    isModalOpen
  });

  // Event handlers for the modal window (open/close)
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const component = getComponent();

  function getComponent() {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <Typography>Could not fetch data due to API error</Typography>;
    }

    return(
      <>
        <pre>{data[page]}</pre>
        <TablePagination
          rowsPerPageOptions={[1]}
          component="div"
          count={data.length || 0}
          rowsPerPage={1}
          page={page}
          onPageChange={handleChangePage}
          labelDisplayedRows={({from, count}) => `${from} / ${count}`}
        />
      </>
    );
  }

  return (
    <>
      <Button
        className="requestButton"
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        <FormattedMessage id={buttonLabelId} />
      </Button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="marcModal">{component}</Box>
      </Modal>
    </>
  );
}

MarcPreviewModal.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  method: PropTypes.string.isRequired,
  buttonLabelId: PropTypes.string.isRequired
};

export default MarcPreviewModal;
