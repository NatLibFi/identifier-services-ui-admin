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
import {FormattedMessage} from 'react-intl';
import {Button} from '@mui/material';

import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/forms/common.css';
import '/src/frontend/css/forms/rangeCreationForm.css';

import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import {validate} from './validate';

function IssnRangeCreationForm(props) {
  const {setModal, setSnackbarMessage, authenticationToken, history} = props;

  // Handles creating a new ISSN range
  async function handleCreateRange(values) {
    // Adding isActive field, since it is required by the API, but is not present in the form
    const formattedValues = {
      ...values,
      isActive: true
    };

    await makeApiRequest({
      url: '/api/issn-registry/ranges',
      method: 'POST',
      values: formattedValues,
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/issn-registry/ranges'
    });

    setModal(false);
  }

  const formFields = ['block', 'rangeBegin', 'rangeEnd'];

  // Required to avoid focus issues on edit (component={renderTextField}})
  // NB! component={(props) => <RenderTextField {...props}/>} approach does not work here for some reason
  const renderTextField = (props) => <RenderTextField {...props} />;

  return (
    <Form onSubmit={handleCreateRange} validate={validate}>
      {({handleSubmit, valid}) => (
        <form onSubmit={handleSubmit} className="rangeCreationForm">
          <div className="rangeCreationContainer">
            {formFields.map((field) => (
              <Field
                key={field}
                name={field}
                type="text"
                className="selectField"
                label={<FormattedMessage id={`ranges.${field}`} />}
                // See comment above about the renderTextField function
                component={renderTextField}
              />
            ))}
          </div>
          <Button variant="contained" color="primary" type="submit" disabled={!valid}>
            <FormattedMessage id="form.button.label.submit" />
          </Button>
        </form>
      )}
    </Form>
  );
}

IssnRangeCreationForm.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired
};

export default IssnRangeCreationForm;
