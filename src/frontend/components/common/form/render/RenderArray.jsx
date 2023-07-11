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
import PropTypes from 'prop-types';

import {
  Grid,
  Chip,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableContainer
} from '@mui/material';

import '/src/frontend/css/listComponent.css';

import {classificationCodes, electronicFormats, printFormats} from '/src/frontend/components/common/form/constants';
import RenderEditNoncreatableMultiselect from './RenderEditNoncreatableMultiselect.jsx';
import RenderOtherAndPreviousNames from './RenderOtherAndPreviousNames.jsx';
import RenderClassification from './RenderClassification.jsx';
import RenderEditAuthorRoles from './RenderEditAuthorRoles.jsx';

function RenderArray(props) {
  const {value, fieldName, edit, label} = props;

  // Renders when editing array fields
  if (edit) {
    // Author roles are stored to fieldNames role1,role2,role3,role4
    // Using this conditional expression instead of multiple switch statements
    if (fieldName.length > 4 && fieldName.substring(0, 4) === 'role') {
      return (
        <>
          <Grid item xs={6}>
            <span className="label">{label}:</span>
          </Grid>
          <RenderEditAuthorRoles fieldName={fieldName} />
        </>
      );
    }

    if (fieldName === 'classification') {
      return (
        <>
          <Grid item xs={6}>
            <span className="label">{label}:</span>
          </Grid>
          <RenderEditNoncreatableMultiselect
            fieldName={fieldName}
            options={classificationCodes}
          />
        </>
      );
    }

    if (fieldName === 'fileformat') {
      return (
        <>
          <Grid item xs={6}>
            <span className="label">{label}:</span>
          </Grid>
          <RenderEditNoncreatableMultiselect
            fieldName={fieldName}
            options={electronicFormats}
          />
        </>
      );
    }

    if (fieldName === 'printFormat') {
      return (
        <>
          <Grid item xs={6}>
            <span className="label">{label}:</span>
          </Grid>
          <RenderEditNoncreatableMultiselect
            fieldName={fieldName}
            options={printFormats}
          />
        </>
      );
    }

    if (fieldName === 'previousNames') {
      return (
        <>
          <RenderOtherAndPreviousNames fieldName={fieldName} />
        </>
      );
    }
  }

  // Non-edit renders for array fields

  if (fieldName === 'classification') {
    return (
      <div className="classificationCodes">
        <Grid item xs={6}>
          <span className="label">{label}:</span>
        </Grid>
        <div>
          {value.length === 0 ? (
            <FormattedMessage id="common.noValue" />
          ) : (
            value.map((item) => (
              <Grid key={item} item>
                <Chip label={<RenderClassification value={item} />} />
              </Grid>
            ))
          )}
        </div>
      </div>
    );
  }

  if (fieldName === 'publisherIdentifier') {
    return value.map((item) => <Chip key={item} label={item} />);
  }

  if (fieldName === 'previousNames') {
    return (
      <div className="classificationCodes">
        <Grid item xs={6}>
          <span className="label">{label}:</span>
        </Grid>
        <div>
          {value.map((item) => (
            <Grid key={item} item>
              <Chip label={item} />
            </Grid>
          ))}
        </div>
      </div>
    );
  }

  if (fieldName === 'publicationType' || fieldName === 'printFormat') {
    return (
      <Grid item container className="arrayContainer">
        <Grid item xs={6}>
          <span className="label">{label}:</span>
        </Grid>
        <Grid item xs={6}>
          {value.map((item) => (
            <Chip
              key={item}
              label={
                <FormattedMessage
                  id={`form.printFormat.${item === 'OTHER' ? 'other_electronical' : item?.toLowerCase()
                  }`}
                />
              }
            />
          ))}
        </Grid>
      </Grid>
    );
  }

  if (fieldName === 'fileformat') {
    return (
      <Grid item container className="arrayContainer">
        <Grid item xs={6}>
          <span className="label">{label}:</span>
        </Grid>
        <Grid item xs={6}>
          {value.map((item) => (
            <Chip
              key={item}
              label={<FormattedMessage id={`form.fileFormat.${item?.toLowerCase()}`} />}
            />
          ))}
        </Grid>
      </Grid>
    );
  }

  if (fieldName === 'type') {
    return (
      <Grid item container className="arrayContainer">
        <Grid item xs={6}>
          <span className="label">{label}:</span>
        </Grid>
        <Grid item xs={6}>
          {value.map((item) => (
            <Chip
              key={item}
              label={
                <FormattedMessage id={`form.printFormat.${item?.toLowerCase()}`} />
              }
            />
          ))}
        </Grid>
      </Grid>
    );
  }

  if (fieldName === 'issn_another_medium' || fieldName === 'issn_subseries' || fieldName === 'issn_main_series') {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.name'} />
                </strong>
              </TableCell>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.identifier'} />
                </strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map((item) => (
              <TableRow key={item.title}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.issn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (fieldName === 'issn_previous') {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.name'} />
                </strong>
              </TableCell>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.identifier'} />
                </strong>
              </TableCell>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.lastIssue'} />
                </strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map((item) => (
              <TableRow key={item.title}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.issn}</TableCell>
                <TableCell>{item.lastIssue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (fieldName === 'contactPerson') {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.name'} />
                </strong>
              </TableCell>
              <TableCell>
                <strong>
                  <FormattedMessage id={'table.headRows.email'} />
                </strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map((item) => (
              <TableRow key={item.name}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Grid item container className="arrayContainer">
      <Grid item xs={6}>
        <span className="label">{label}:</span>
      </Grid>
      <Grid item xs={6}>
        {value.map((item) => (
          <Chip
            key={item}
            label={<FormattedMessage id={`common.${item?.toLowerCase()}`} />}
          />
        ))}
      </Grid>
    </Grid>
  );
}

RenderArray.propTypes = {
  fieldName: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  edit: PropTypes.oneOfType([PropTypes.func, PropTypes.bool])
};

export default RenderArray;
