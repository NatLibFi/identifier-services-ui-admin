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

import {Form} from 'react-final-form';
import {FormattedMessage} from 'react-intl';

import {Button} from '@mui/material';

import FormEditErrorCard from '/src/frontend/components/isbn-registry/subComponents/cards/FormEditErrorCard.jsx';
import {validate} from '/src/frontend/components/isbn-registry/publisherRequests/validate';

function IsbnPublisherEditForm({publisherRequest, onSubmit, handleCancel, children}) {
  return (
    <Form
      onSubmit={onSubmit}
      validate={validate}
      initialValues={publisherRequest}
    >
      {({handleSubmit, valid, errors}) => (
        <form onSubmit={handleSubmit}>
          <div className="updateContainer">
            <div className="updateButtonsContainer">
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={!valid}
              >
                <FormattedMessage id="form.button.label.update" />
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
            </div>
            {/* Display an error message if the form is not valid */}
            <FormEditErrorCard valid={valid} errors={errors} />
          </div>
          <div className="listItemSpinner">{children}</div>
        </form>
      )}
    </Form>
  );
}

IsbnPublisherEditForm.propTypes = {
  publisherRequest: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  children: PropTypes.node
};

export default IsbnPublisherEditForm;
