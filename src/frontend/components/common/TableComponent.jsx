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

import React from 'react';
import {PropTypes} from 'prop-types';
import {FormattedMessage, useIntl} from 'react-intl';
import {v4 as uuidv4} from 'uuid';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableContainer
} from '@mui/material';

import TableRowComponent from './TableRowComponent.jsx';

import '/src/frontend/css/tableComponent.css';

function TableComponent(props) {
  const {
    data,
    totalDoc,
    headRows,
    handleTableRowClick,
    page = 0,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    unprioritizedRows = [],
    unprioritizedMobileRows = [],
    notClickable
  } = props;

  const intl = useIntl();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Used for hiding less important columns on small screens
  const hideColumn = (key) => {
    const styles = [];

    if (unprioritizedRows.includes(key)) {
      styles.push('hiddenColumns');
    }

    if (unprioritizedMobileRows.includes(key)) {
      styles.push('hiddenColumnsMobile');
    }

    return styles.join(' ');
  };


  return (
    <Paper className="tableWrapper">
      <TableContainer>
        <Table>
          {/* Render table headers */}
          <TableHead>
            <TableRow>
              {headRows.map((row) => (
                <TableCell key={row.id} className={hideColumn(row.id)}>
                  <strong>
                    <FormattedMessage id={row.intlId} />
                  </strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {/* Render table body content */}
          <TableBody>
            {data.map((row) => {
              return (
                <TableRowComponent
                  key={uuidv4()}
                  row={row}
                  headRows={headRows}
                  handleTableRowClick={handleTableRowClick}
                  hideColumn={hideColumn}
                  notClickable={notClickable}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        // Display pagination if setPage is defined
        setPage && (
          <TablePagination
            rowsPerPageOptions={[1, 5, 10, 25, 50]}
            component="div"
            count={totalDoc || 0}
            rowsPerPage={rowsPerPage || 0}
            page={page || 0}
            labelRowsPerPage={<FormattedMessage id="table.rowsPerPage" />}
            labelDisplayedRows={({from, count}) =>
              rowsPerPage < count
                ? `${intl.formatMessage({id: 'table.forms'})} - ${from}-${
                  rowsPerPage * (page + 1)
                } / ${intl.formatMessage({id: 'table.total'})} - ${count}`
                : `${intl.formatMessage({id: 'table.formsOnOnePage'})} - ${count}`
            }
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            // Adding aria-label to the inner select element (Rows per page)
            SelectProps={{
              inputProps: {'aria-label': intl.formatMessage({id: 'table.rowsPerPage'})},
              native: true
            }}
          />
        )
      }
    </Paper>
  );
}

TableComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  headRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  totalDoc: PropTypes.number,
  page: PropTypes.number,
  setPage: PropTypes.func,
  rowsPerPage: PropTypes.number,
  setRowsPerPage: PropTypes.func,
  notClickable: PropTypes.bool,
  handleTableRowClick: PropTypes.func,
  unprioritizedRows: PropTypes.arrayOf(PropTypes.string),
  unprioritizedMobileRows: PropTypes.arrayOf(PropTypes.string)
};

export default TableComponent;
