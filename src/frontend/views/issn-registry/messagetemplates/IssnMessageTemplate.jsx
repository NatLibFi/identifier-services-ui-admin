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

import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';

import {Form, Field} from 'react-final-form';
import {useParams, withRouter} from 'react-router-dom';
import {FormattedMessage, useIntl} from 'react-intl';

import {Button, Typography} from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';
import useList from '/src/frontend/hooks/useList';
import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/messages/messageTemplate.css';

import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import RenderSelect from '/src/frontend/components/common/form/render/RenderSelect.jsx';
import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import {deepCompareObjects} from '/src/frontend/components/utils';

function IssnMessageTemplateFormFields(props) {
  const {editorRef, messageTemplate, messageTypesList} = props;

  const intl = useIntl();

  return (
    <>
      <div className="templateEditableFields">
        <Field
          name="name"
          component={(props) => <RenderTextField {...props} />}
          variant="outlined"
          label={<FormattedMessage id="common.name" />}
        />
        <Field
          name="subject"
          component={(props) => <RenderTextField {...props} />}
          variant="outlined"
          label={<FormattedMessage id="messages.subject" />}
        />
        <Field
          name="langCode"
          component={(props) => <RenderSelect {...props} />}
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
          component={(props) => <RenderSelect {...props} />}
          options={messageTypesList.map((type) => ({label: type.name, value: type.id}))}
          variant="outlined"
          label={intl.formatMessage({id: 'messages.messageType'})}
        />
      </div>
      {/* Message body (tinyMCE editor) */}
      <BundledEditor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={messageTemplate.message}
      />
    </>
  );
}

IssnMessageTemplateFormFields.propTypes = {
  editorRef: PropTypes.object.isRequired,
  messageTemplate: PropTypes.object.isRequired,
  messageTypesList: PropTypes.array.isRequired
};

const MemoizedIssnMessageTemplateFormFields = React.memo(IssnMessageTemplateFormFields, deepCompareObjects);

function IssnMessageTemplate() {
  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const params = useParams();
  const {id} = params;

  const editorRef = useRef(null);

  // Message template list loading
  const {data: messageTypesList} = useList({
    url: '/api/issn-registry/messagetypes',
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
    url: `/api/issn-registry/messagetemplates/${id}`,
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
      message: editorRef ? editorRef.current.getContent() : undefined
    };

    await makeApiRequest({
      url: `/api/issn-registry/messagetemplates/${id}`,
      method: 'PUT',
      values: updatedValues,
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/issn-registry/messagetemplates',
      filterMetadataFields: true
    });
  }

  // Handles cancel updating the form, redirects to the previous page
  const handleCancelUpdating = () => {
    history.push('/issn-registry/messagetemplates');
  };

  // Event handler for the delete button
  async function handleDeleteTemplate() {
    await makeApiRequest({
      url: `/api/issn-registry/messagetemplates/${id}`,
      method: 'DELETE',
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/issn-registry/messagetemplates'
    });
  }

  if (error) {
    return (
      <Typography variant="h2" className="normalTitle">
        <FormattedMessage id="errorPage.message.defaultError" />
      </Typography>
    );
  }

  if (loading || Object.keys(messageTemplate).length === 0) {
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
            <MemoizedIssnMessageTemplateFormFields
              editorRef={editorRef}
              messageTemplate={messageTemplate}
              messageTypesList={messageTypesList}
            />
          </form>
        )}
      </Form>
    </div>
  );
}

export default withRouter(IssnMessageTemplate);
