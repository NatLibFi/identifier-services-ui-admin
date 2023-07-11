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
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Grid, Typography} from '@mui/material';

import useList from '/src/frontend/hooks/useList';

import '/src/frontend/css/common.css';
import '/src/frontend/css/identifierRanges/range.css';

import ModalLayout from '/src/frontend/components/common/ModalLayout.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import RangeCreationForm from '/src/frontend/components/isbn-registry/identifierRanges/ismn/IsmnRangeCreationForm.jsx';

function IsmnRangeList(props) {
  const {authenticationToken, history, setSnackbarMessage} = props;

  const [modal, setModal] = useState(false); // eslint-disable-line no-unused-vars

  const {data, loading, error} = useList({
    url: '/api/isbn-registry/ranges/ismn',
    method: 'GET',
    authenticationToken,
    prefetch: false,
    fetchOnce: true,
    requireAuth: true,
    modalIsUsed: false
  });

  const handleTableRowClick = (id) => {
    history.push(`/isbn-registry/ranges/ismn/${id}`);
  };

  // Titles of the columns in the table
  function getHeadRows() {
    const headers = [
      'prefix',
      'category',
      'rangeBegin',
      'rangeEnd',
      'free',
      'taken',
      'isActive',
      'isClosed'
    ];

    return headers.reduce((acc, k) => {
      acc.push({id: `${k}`, intlId: `table.headRows.${k}`});
      return acc;
    }, []);
  }

  function formatDataEntry(entry) {
    return {
      ...entry,
      free: entry.free + entry.canceled,
      taken: entry.taken - entry.canceled
    };
  }

  const dataComponent = setDataComponent();

  function setDataComponent() {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <Typography>Could not fetch data due to API error</Typography>;
    }

    return(
      <TableComponent
        pagination
        data={data
          .sort((a, b) => a.rangeBegin - b.rangeBegin)
          .sort((a, b) => a.category - b.category)
          .map(formatDataEntry)}
        handleTableRowClick={handleTableRowClick}
        headRows={getHeadRows()}
        totalDoc={data.length}
        // Those are not displayed on small screens (mobile devices etc)
        // screen < 900px
        unprioritizedRows={['rangeBegin', 'rangeEnd', 'taken', 'next', 'isClosed']}
      />
    );
  }

  return (
    <Grid item xs={12} className="listSearch">
      <Typography variant="h5" className="rangesTitleColorISMN">
        <FormattedMessage id="ranges.title" values={{type: 'ISMN'}} />
      </Typography>
      {/* Form for creating a new range (opens in modal window) */}
      <div className="identifierCreationModal">
        <ModalLayout
          isTableRow
          setModal={setModal}
          color="primary"
          title={<FormattedMessage id="ranges.add.button" values={{type: 'ISMN'}} />}
          label={<FormattedMessage id="ranges.add.button" values={{type: 'ISMN'}} />}
          name="rangeCreation"
          variant="outlined"
        >
          <RangeCreationForm
            setSnackbarMessage={setSnackbarMessage}
            authenticationToken={authenticationToken}
            history={history}
            handleClose={() => setModal(false)}
          />
        </ModalLayout>
      </div>
      {dataComponent}
    </Grid>
  );
}

IsmnRangeList.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default IsmnRangeList;
