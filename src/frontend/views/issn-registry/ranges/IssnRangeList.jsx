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

import React, {useMemo, useState} from 'react';

import {useHistory} from 'react-router-dom';
import {useAuth} from 'react-oidc-context';

import {FormattedMessage} from 'react-intl';

import {Grid, Typography} from '@mui/material';

import useList from '/src/frontend/hooks/useList';

import '/src/frontend/css/common.css';
import '/src/frontend/css/identifierRanges/range.css';

import ModalLayout from '/src/frontend/components/common/ModalLayout.jsx';
import TableComponent from '/src/frontend/components/common/TableComponent.jsx';
import TableResultWrapper from '/src/frontend/components/common/TableResultWrapper.jsx';

import IssnRangeCreationForm from '/src/frontend/components/issn-registry/identifierRanges/IssnRangeCreationForm.jsx';

function IssnRangeList() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const [modal, setModal] = useState(false); // eslint-disable-line no-unused-vars

  const {data, loading, error} = useList({
    url: '/api/issn-registry/ranges',
    method: 'GET',
    authenticationToken,
    prefetch: false,
    fetchOnce: true,
    requireAuth: true,
    modalIsUsed: false
  });

  const formattedData = useMemo(() => data.map(formatDataEntry), [data]);
  const hasData = formattedData && formattedData.length > 0;

  const handleTableRowClick = (id) => {
    history.push(`/issn-registry/ranges/${id}`);
  };

  // Titles of the columns in the table
  function getHeadRows() {
    const headers = [
      'id',
      'block',
      'rangeBegin',
      'rangeEnd',
      'free',
      'isActive',
      'isClosed'
    ];

    return headers.reduce((acc, k) => {
      acc.push({id: `${k}`, intlId: `table.headRows.${k}`});
      return acc;
    }, []);
  }

  // Format data for displaying in the table
  function formatDataEntry(entry) {
    return {
      ...entry,
      // Formatting rangeBegin & rangeEnd since those fields were presented this way in the old version (joomla)
      rangeBegin: `${entry.block}-${entry.rangeBegin}`,
      rangeEnd: `${entry.block}-${entry.rangeEnd}`
    };
  }

  return (
    <Grid item xs={12} className="listSearch">
      <Typography variant="h5" className="rangesTitleColorISSN">
        <FormattedMessage id="ranges.title" values={{type: 'ISSN'}} />
      </Typography>
      {/* Form for creating a new range (opens in modal window) */}
      <div className="identifierCreationModal">
        <ModalLayout
          isTableRow
          setModal={setModal}
          color="primary"
          title={<FormattedMessage id="ranges.add.button" values={{type: 'ISSN'}} />}
          label={<FormattedMessage id="ranges.add.button" values={{type: 'ISSN'}} />}
          name="rangeCreation"
          variant="outlined"
        >
          <IssnRangeCreationForm setModal={setModal} />
        </ModalLayout>
      </div>
      <TableResultWrapper error={error} loading={loading} hasData={hasData}>
        <TableComponent
          pagination
          data={formattedData}
          handleTableRowClick={handleTableRowClick}
          headRows={getHeadRows()}
          totalDoc={data.length}
          // Those are not displayed on small screens (mobile devices etc)
          // screen < 900px
          unprioritizedRows={['rangeBegin', 'rangeEnd']}
        />
      </TableResultWrapper>
    </Grid>
  );
}

export default IssnRangeList;
