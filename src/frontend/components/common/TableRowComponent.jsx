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
import {FormattedMessage} from 'react-intl';
import {PropTypes} from 'prop-types';
import {v4 as uuidv4} from 'uuid';

import {TableCell, TableRow} from '@mui/material';
import BookIcon from '@mui/icons-material/MenuBook';
import MusicIcon from '@mui/icons-material/LibraryMusic';
import SchoolIcon from '@mui/icons-material/School';
import MapIcon from '@mui/icons-material/Map';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import {PUBLICATION_TYPES} from '/src/frontend/components/common/form/constants';

function TableRowComponent(props) {
  const {row, headRows, handleTableRowClick, hideColumn, notClickable} = props;

  // Adding an icon depending on publication type - book/music/dissertation/map/other
  const getPublicationTypeIcon = (publicationType) => {
    if (publicationType === PUBLICATION_TYPES.BOOK) {
      return <BookIcon />;
    }

    if (publicationType === PUBLICATION_TYPES.SHEET_MUSIC) {
      return <MusicIcon />;
    }

    if (publicationType === PUBLICATION_TYPES.DISSERTATION) {
      return <SchoolIcon />;
    }

    if (publicationType === PUBLICATION_TYPES.MAP) {
      return <MapIcon />;
    }

    if (publicationType === PUBLICATION_TYPES.OTHER) {
      return <LibraryBooksIcon />;
    }

    return null;
  };

  // Used for trimming long strings in table cells (max. 20 characters by default)
  const truncate = (str, n = 20) => {
    return str !== null && str.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  // Fields below are rendered using <FormattedMessage/> translation component
  // In other cases we render table data as it is, without translation
  const translatableFields = [
    'isActive',
    'isClosed',
    'langCode',
    'language',
    'publicationType',
    'status',
    'medium'
  ];

  return (
    <TableRow
      hover
      // If table should not be interactive, tab index is set to -1 to make table rows unfocusable and unclickable
      // Otherwise tab index is set to 0 to make table rows focusable and clickable
      tabIndex={notClickable ? -1 : 0}
      key={uuidv4()}
      className="tableRow"
      onClick={() => handleTableRowClick(row.id)}
      onKeyDown={(event) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          handleTableRowClick(row.id);
        }
      }}
    >
      {headRows.reduce((acc, h) => {
        Object.keys(row).forEach(
          (key) =>
            h.id === key &&
          acc.push(
            <TableCell key={uuidv4()} className={hideColumn(key)}>
              {/* Add styling to publication type cells (publication requests) */}
              <div className={h.id === 'publicationType' ? 'tableRowInnerContainer' : ''}>
                {getPublicationTypeIcon(row[key])}

                {/* Text content of a table cell */}
                {translatableFields.includes(h.id) ? (
                  // Translating fields that should be translated
                  <span
                    className={
                      // Adding a class to active/inactive cells for styling purposes
                      h.id === 'isActive' ? (row[key] ? 'active' : 'inactive') : ''
                    }
                  >
                    <FormattedMessage id={`common.${row[key]}`} />
                  </span>
                ) : // Trimming long strings in table cells
                  h.id === 'comments' || h.id === 'additionalInfo' ? (
                    truncate(row[key])
                  ) : // Displaying active identifiers in a separate div one below the other (publishers)
                    h.id === 'activeIdentifiers' ? (
                      row[key].map((subRange) => (
                        <div key={uuidv4()}>
                          {subRange.isbn && (
                            <div className="activeIdentifiersTableRows">
                              <span>ISBN:</span>
                              {subRange.isbn}
                            </div>
                          )}
                          {subRange.ismn && (
                            <div className="activeIdentifiersTableRows">
                              <span>ISMN:</span>
                              {subRange.ismn}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                    // Base case - displaying data as it is
                      row[key]
                    )}
              </div>
            </TableCell>
          )
        );
        return acc;
      }, [])}
    </TableRow>
  );
}

TableRowComponent.propTypes = {
  row: PropTypes.object.isRequired,
  headRows: PropTypes.array.isRequired,
  handleTableRowClick: PropTypes.func.isRequired,
  hideColumn: PropTypes.func.isRequired,
  notClickable: PropTypes.bool
};

export default TableRowComponent;
