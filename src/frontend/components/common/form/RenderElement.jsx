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
import {Field} from 'react-final-form';
import {PropTypes} from 'prop-types';
import {useIntl} from 'react-intl';

import {Grid, Typography, Link} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';

import PopoverComponent from '/src/frontend/components/common/PopoverComponent.jsx';
import RenderDateTime from './render/RenderDateTime.jsx';
import RenderMultiSelect from './render/RenderMultiSelect.jsx';
import RenderSelect from './render/RenderSelect.jsx';
import RenderTextField from './render/RenderTextField.jsx';
import RenderTextArea from './render/RenderTextArea.jsx';

import '/src/frontend/css/forms/common.css';

function RenderElement(props) {
  const intl = useIntl();
  const {array, fieldName, publicationIsbnValues} = props;

  function translateOptions(options, intl) {
    return options ? options.map(v => {
      // Empty values should not be translated
      if (v.label) {
        return {
          label: intl.formatMessage({id: `${v.label}`}),
          value: v.value
        };
      }
      return v;
    }) : [];
  }

  return array.map(formField => {
    // Options that should not be translated (month and year translations comes straight from the moment library)
    const nonTranslatableOptions = ['publicationYear', 'publicationMonth'];
    // Translation of options for select and multiselect
    const translatedOptions = ((formField.type === 'select' || formField.type === 'multiSelect') && !nonTranslatableOptions.includes(formField.name))
      ? translateOptions(formField.options, intl)
      : formField.options;

    if (formField.type === 'dateTime') {
      return (
        <Grid key={formField.name} item xs={formField.width === 'half' ? 6 : 12}>
          <Field
            component={(props) => <RenderDateTime {...props} />}
            label={formField.label}
            name={formField.name}
            min={formField.min}
            max={formField.max}
            inputFormat={formField.inputFormat}
            views={formField.views}
            helperText={formField.helperText}
            info={formField.info}
          />
        </Grid>
      );
    }

    if (formField.type === 'select') {
      return (
        <Grid key={formField.name} item xs={formField.width === 'half' ? 6 : 12}>
          {formField.title &&
            <Typography className="selectTitle">
              {formField.title}
            </Typography>
          }
          <Field
            className='selectField'
            component={(props) => <RenderSelect {...props} />}
            label={intl.formatMessage({id: formField.label})}
            name={formField.name}
            type={formField.type}
            options={translatedOptions}
            publicationValues={publicationIsbnValues}
            defaultValue={formField.defaultValue}
            isDisabled={formField.isDisabled}
          />
        </Grid>
      );
    }

    if (formField.type === 'multiSelect') {
      return (
        <Grid
          key={formField.name}
          container
          item
          xs={formField.width === 'half' ? 6 : 12}
        >
          <Grid item xs={12}>
            <Field
              className='selectField'
              component={(props) => <RenderMultiSelect {...props} />}
              label={formField.label}
              placeholder={formField?.placeholder}
              infoIconComponent={
                formField.instructions && (
                  <PopoverComponent
                    icon={<HelpIcon />}
                    infoText={formField.instructions}
                  />
                )
              }
              name={formField.name}
              type={formField.type}
              options={translatedOptions}
              isMulti={formField.isMulti}
              isCreatable={formField.isCreatable}
              ariaLabel={formField.ariaLabel}
            />
          </Grid>
        </Grid>
      );
    }

    if (formField.type === 'numeric') {
      return (
        <Grid key={formField.name} item xs={formField.width === 'full' ? 12 : 6}>
          <Field
            className='textField'
            component={(props) => <RenderTextField {...props} />}
            label={formField.label}
            name={formField.name}
            type="text"
            min={0}
            disabled={Boolean(formField.name === 'publisher')}
          />
        </Grid>
      );
    }

    if (formField.type === 'text') {
      return (
        <Grid key={formField.name} item xs={formField.width === 'full' ? 12 : 6}>
          <Field
            className='textField'
            component={(props) => <RenderTextField {...props} />}
            label={formField.label}
            name={formField.name}
            type={formField.type}
            infoIconComponent={
              formField.instructions && (
                <PopoverComponent
                  icon={<HelpIcon />}
                  infoText={formField.instructions}
                />
              )
            }
            disabled={formField.disable}
          />
          {formField.link && (
            <>
              <PopoverComponent
                icon={<HelpIcon />}
                infoText={formField.instructions}
              />
              <Link
                target="_blank"
                rel="noreferrer"
                href={formField.link}
                color="primary"
                underline="always"
              >
                {' '}
                additional information{' '}
              </Link>
            </>
          )}
        </Grid>
      );
    }

    if (formField.type === 'textArea') {
      return (
        <Grid key={formField.name} item xs={formField.width === 'full' ? 12 : 6}>
          <Field
            className="textArea full"
            component={(props) => <RenderTextArea {...props} />}
            name={fieldName ? fieldName : formField.name}
            label={formField.label}
            type="multiline"
            ariaLabel={formField.ariaLabel}
          />
        </Grid>
      );
    }

    return null;
  });
}

RenderElement.propTypes = {
  array: PropTypes.array.isRequired,
  fieldName: PropTypes.string,
  publicationIsbnValues: PropTypes.array
};

export default RenderElement;
