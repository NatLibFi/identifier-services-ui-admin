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

import {identifierTypeOptionsIsbn, langCodeOptions} from '../../common/form/constants';

export const GROUPMESSAGE_FORM_FIELDS = [
  {
    name: 'groupIdentifier',
    type: 'select',
    label: 'form.groupmessages.type.label',
    options: identifierTypeOptionsIsbn
  },
  {
    name: 'groupCategory',
    type: 'select',
    label: 'form.groupmessages.category.label',
    options: [{label: '', value: ''}, ...[...Array(7).keys()].map(v => ({label: `form.groupmessages.category.${v+1}`, value: v+1}))]
  },
  {
    name: 'groupLanguage',
    type: 'select',
    label: 'form.groupmessages.language.label',
    options: [{label: '', value: ''}, ...langCodeOptions]
  }
];
