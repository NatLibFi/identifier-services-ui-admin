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
import PropTypes from 'prop-types';
import {Form, Field} from 'react-final-form';
import {FormattedMessage, useIntl} from 'react-intl';
import {Button} from '@mui/material';

import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/forms/common.css';
import '/src/frontend/css/forms/rangeCreationForm.css';

import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import RenderSelect from '/src/frontend/components/common/form/render/RenderSelect.jsx';

import {validate} from './validate';

function IsbnRangeCreationForm(props) {
  const {authenticationToken, setSnackbarMessage, handleClose, history} = props;
  const intl = useIntl();

  // Handles creating a new ISBN range
  async function handleCreateRange(values) {
    await makeApiRequest({
      url: '/api/isbn-registry/ranges/isbn',
      method: 'POST',
      values,
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/isbn-registry/ranges/isbn'
    });

    handleClose();
  }

  const formFields = [
    {name: 'prefix', type: 'select', option: prefixOptions()},
    {name: 'langGroup', type: 'select', option: langGroupOptions()},
    {name: 'category', type: 'select', option: categoryOptions()},
    {name: 'rangeBegin', type: 'text'},
    {name: 'rangeEnd', type: 'text'}
  ];

  function prefixOptions() {
    return [
      {label: '', value: ''},
      {label: '978', value: 978},
      {label: '979', value: 979}
    ];
  }

  function langGroupOptions() {
    return [
      {label: '', value: ''},
      {label: '951', value: 951},
      {label: '952', value: 952}
    ];
  }

  function categoryOptions() {
    return [
      {label: '', value: ''},
      {label: '1', value: 1},
      {label: '2', value: 2},
      {label: '3', value: 3},
      {label: '4', value: 4},
      {label: '5', value: 5}
    ];
  }

  // Required to avoid focus issues on edit (component={renderTextField}})
  // NB! component={(props) => <RenderTextField {...props}/>} approach does not work here for some reason
  const renderTextField = (props) => <RenderTextField {...props} />;
  const renderSelectField = (props) => <RenderSelect {...props} />;

  return (
    <Form onSubmit={handleCreateRange} validate={validate}>
      {({handleSubmit, valid}) => (
        <form onSubmit={handleSubmit} className="rangeCreationForm">
          <div className="rangeCreationContainer">
            {formFields.map((field) =>
              field.type === 'text' ? (
                <Field
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  className="selectField"
                  label={field.name ? intl.formatMessage({id: `ranges.${field.name}`}) : ''}
                  // See comment above about the renderTextField function
                  component={renderTextField}
                />
              ) : (
                <Field
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  className="selectField"
                  label={field.name ? intl.formatMessage({id: `ranges.${field.name}`}) : ''}
                  options={field.option}
                  // See comment above about the renderSelectField function
                  component={renderSelectField}
                />
              )
            )}
          </div>
          <Button variant="contained" color="primary" type="submit" disabled={!valid}>
            <FormattedMessage id="form.button.label.submit" />
          </Button>
        </form>
      )}
    </Form>
  );
}

IsbnRangeCreationForm.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default IsbnRangeCreationForm;
