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

import {classificationCodes} from '/src/frontend/components/common/form/constants';

export function formatPublisherForEdit(values, intl) {
  if (values && Object.keys(values).length > 0) {
    const formattedValues = {
      ...values,
      classification: values.classification
        ? values.classification
          .map((item) => formatClassificationForEditing(item))
          .map((item) => ({
            label: item?.label && intl.formatMessage({id: item.label}),
            value: item?.value
          }))
        : [],
      previousNames: values.previousNames.map((item) => ({value: item, label: item}))
    };

    return formattedValues;
  }

  function formatClassificationForEditing(v) {
    return classificationCodes.find((item) => item.value === v);
  }
}
