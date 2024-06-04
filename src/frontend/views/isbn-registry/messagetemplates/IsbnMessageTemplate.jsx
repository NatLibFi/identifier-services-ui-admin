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

import React, {useRef} from 'react';
import PropTypes from 'prop-types';

import {Form, Field} from 'react-final-form';

import {useAuth} from 'react-oidc-context';
import {useHistory, useParams, withRouter} from 'react-router-dom';
import {FormattedMessage, useIntl} from 'react-intl';

import useItem from '/src/frontend/hooks/useItem';
import useList from '/src/frontend/hooks/useList';
import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import {makeApiRequest} from '/src/frontend/actions';

import {Button, Typography} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import '/src/frontend/css/messages/messageTemplate.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import RenderSelect from '/src/frontend/components/common/form/render/RenderSelect.jsx';
import {deepCompareObjects} from '/src/frontend/components/utils';

// NB: form fields have been separated in order to memoize the component and avoid
// re-render issues during token refresh
function IsbnMessageTemplateFields(props) {
  const {editorRef, messageTemplate, messageTypesList} = props;

  const intl = useIntl();

  // Required to avoid focus issues on edit (component={renderTextField}})
  // NB! component={(props) => <RenderTextField {...props}/>} approach does not work here for some reason
  const renderSelect = (props) => <RenderSelect {...props} />;
  const renderTextField = (props) => <RenderTextField {...props} />;

  return (
    <div>
      <div className="templateEditableFields">
        <Field
          name="name"
          // See comment above about the renderTextField function
          component={renderTextField}
          variant="outlined"
          label={<FormattedMessage id="common.name" />}
        />
        <Field
          name="subject"
          // See comment above about the renderTextField function
          component={renderTextField}
          variant="outlined"
          label={<FormattedMessage id="messages.subject" />}
        />
        <Field
          name="langCode"
          // See comment above about the renderSelect function
          component={renderSelect}
          options={[
            {label: 'Suomi', value: 'fi-FI'},
            {label: 'English ', value: 'en-GB'},
            {label: 'Svenska', value: 'sv-SE'}
          ]}
          variant="outlined"
          label={intl.formatMessage({id: 'form.common.language'})}
        />
        <Field
          name="messageTypeId"
          // See comment above about the renderSelect function
          component={renderSelect}
          options={messageTypesList.map((type) => ({
            label: type.name,
            value: type.id
          }))}
          variant="outlined"
          label={intl.formatMessage({id: 'messages.messageType'})}
        />
      </div>
      {/* Message body (tinyMCE editor) */}
      <BundledEditor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={messageTemplate.message}
      />
    </div>
  );
}

IsbnMessageTemplateFields.propTypes = {
  messageTemplate: PropTypes.object.isRequired,
  editorRef: PropTypes.object.isRequired,
  messageTypesList: PropTypes.array.isRequired
};

const MemoizedIsbnMessageTemplateFields = React.memo(IsbnMessageTemplateFields, deepCompareObjects);

function IsbnMessageTemplate() {
  const history = useHistory();
  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});
  const {user: {access_token: authenticationToken}} = useAuth();

  const params = useParams();

  // ID of a current template
  const {id} = params;
  const editorRef = useRef(null);

  // Message template list loading
  const {data: messageTypesList} = useList({
    url: '/api/isbn-registry/messagetypes',
    method: 'GET',
    authenticationToken,
    prefetch: true,
    fetchOnce: true,
    requireAuth: true,
    modalIsUsed: false
  });

  // Fetching data of the current template
  const {
    data: messageTemplate,
    loading,
    error
  } = useItem({
    url: `/api/isbn-registry/messagetemplates/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Handles the update of the message template
  async function handleMessageTemplateUpdate(values) {
    const updatedValues = {
      ...values,
      name: values.name ?? '',
      subject: values.subject ?? '',
      message: editorRef ? editorRef.current.getContent() : undefined
    };

    await makeApiRequest({
      url: `/api/isbn-registry/messagetemplates/${id}`,
      method: 'PUT',
      values: updatedValues,
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/isbn-registry/messagetemplates',
      filterMetadataFields: true
    });
  }

  // Handles cancel updating the form, redirects to the previous page
  const handleCancelUpdating = () => {
    history.push('/isbn-registry/messagetemplates');
  };

  // Event handler for the delete button
  async function handleDeleteTemplate() {
    await makeApiRequest({
      url: `/api/isbn-registry/messagetemplates/${id}`,
      method: 'DELETE',
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/isbn-registry/messagetemplates'
    });
  }

  if (error) {
    return (
      <Typography variant="h2" className="normalTitle">
        <FormattedMessage id="errorPage.message.defaultError" />
      </Typography>
    );
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="templateContainer">
      <Typography variant="h5">
        <FormattedMessage id="messages.messageTemplate" /> - {messageTemplate.name}
      </Typography>
      <Form onSubmit={handleMessageTemplateUpdate} initialValues={messageTemplate}>
        {({handleSubmit}) => (
          <form onSubmit={handleSubmit}>
            <div className="templateButtonsContainer">
              <div>
                <Button type="submit" variant="contained" color="success">
                  <UpdateIcon />
                  <FormattedMessage id="form.button.label.update" />
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCancelUpdating}
                >
                  <CancelIcon />
                  <FormattedMessage id="form.button.label.cancel" />
                </Button>
              </div>
              <Button variant="contained" color="error" onClick={handleDeleteTemplate}>
                <DeleteIcon />
                <FormattedMessage id="form.button.label.delete" />
              </Button>
            </div>

            <MemoizedIsbnMessageTemplateFields
              messageTemplate={messageTemplate}
              editorRef={editorRef}
              messageTypesList={messageTypesList}
            />
          </form>
        )}
      </Form>
    </div>
  );

}

export default withRouter(IsbnMessageTemplate);
