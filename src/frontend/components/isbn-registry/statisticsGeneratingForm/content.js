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
import moment from 'moment';

import {STATISTIC_TYPE_OPTIONS, STATISTICS_FILEFORMATS_OPTIONS} from './constants';

export const STATISTIC_FORM_FIELDS = [
  {
    name: 'statisticsType',
    type: 'select',
    label: 'statistics.form.type.label',
    options: STATISTIC_TYPE_OPTIONS
  },
  {
    name: 'statisticsFileFormat',
    type: 'select',
    label: 'statistics.form.format.label',
    options: STATISTICS_FILEFORMATS_OPTIONS
  },
  {
    name: 'statisticsBeginDate',
    type: 'dateTime',
    label: <FormattedMessage id="statistics.form.beginDate.label" />,
    // Unix time start as a min value - 01.01.1970
    min: moment(moment(35523).format('YYYY-MM-DD')),
    // Current date as a max value
    max: moment(Date.now()).format('YYYY-MM-DD'),
    inputFormat: 'DD/MM/YYYY',
    views: ['year', 'month', 'day'],
    helperText: <FormattedMessage id="statistics.form.beginDate.helperText" />,
    // Required in the renderDateTime to distinguish situations where the date should not have a default value
    info: 'statisticsForm'
  },
  {
    name: 'statisticsEndDate',
    type: 'dateTime',
    label: <FormattedMessage id="statistics.form.endDate.label" />,
    // Unix time start as a min value - 01.01.1970
    min: moment(moment(35523).format('YYYY-MM-DD')),
    // Current date as a max value
    max: moment(Date.now()).format('YYYY-MM-DD'),
    inputFormat: 'DD/MM/YYYY',
    views: ['year', 'month', 'day'],
    helperText: <FormattedMessage id="statistics.form.endDate.helperText" />,
    // Required in the renderDateTime to distinguish situations where the date should not have a default value
    info: 'statisticsForm'
  }
];
