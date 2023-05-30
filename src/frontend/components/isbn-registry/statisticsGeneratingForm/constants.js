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

const STATISTICS_TYPES = {
  STATISTIC_MONTHLY: 'MONTHLY',
  STATISTIC_PROGRESS_ISBN: 'PROGRESS_ISBN',
  STATISTIC_PROGRESS_ISMN: 'PROGRESS_ISMN',
  STATISTIC_PUBLISHER_ISBN_UNIQUE: 'PUBLISHERS_ISBN_UNIQUE',
  STATISTIC_PUBLISHER_ISMN_UNIQUE: 'PUBLISHERS_ISMN_UNIQUE',
  STATISTIC_PUBLISHER_ISBN: 'PUBLISHERS_ISBN',
  STATISTIC_PUBLISHER_ISMN: 'PUBLISHERS_ISMN',
  STATISTIC_PUBLICATION_ISBN: 'PUBLICATIONS_ISBN',
  STATISTIC_PUBLICATION_ISMN: 'PUBLICATIONS_ISMN'
};

const STATISTICS_FILEFORMATS = {
  JSON: 'json',
  CSV: 'csv',
  XLSX: 'xlsx'
};

export const STATISTIC_TYPE_OPTIONS = [
  {label: '', value: ''},
  ...Object.values(STATISTICS_TYPES).map((v) => ({
    label: `statistics.type.${v}`,
    value: v
  }))
];

export const STATISTICS_FILEFORMATS_OPTIONS = [
  {label: '', value: ''},
  ...Object.values(STATISTICS_FILEFORMATS).map((v) => ({
    label: `statistics.format.${v}`,
    value: v
  }))
];
