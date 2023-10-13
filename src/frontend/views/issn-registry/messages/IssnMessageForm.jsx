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
import {FormattedMessage} from 'react-intl';
import {Field, Form} from 'react-final-form';
import {Button, Typography, Box, Link} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/forms/sendMessageForm.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import {validateSendMessage} from '/src/frontend/components/common/validation';

function IssnMessageForm(props) {
  const {userInfo, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  // Redirect if history action is not PUSH to avoid previous states leaking to message sending process
  if (!history || history.action !== 'PUSH') {
    history.push('/errorpage');
  }

  const {messageCode, identifierBatchId, publisherId, formId} = history.location.state;
  const editorRef = useRef(null);
  const generateMessageParameters = {
    code: messageCode,
    publisherId,
    formId,
    identifierBatchId
  };

  const {data, loading, error} = useItem({
    url: '/api/issn-registry/messages/loadtemplate',
    method: 'POST',
    body: generateMessageParameters,
    authenticationToken,
    dependencies: [],
    prefetch: true,
    fetchOnce: true,
    requireAuth: true
  });

  // Handles approving sending a message
  async function handleApproveSendingMessage(values) {
    const sendMessageParams = {
      publisherId,
      formId,
      langCode: data.langCode,
      messageTemplateId: data.messageTemplateId,
      recipient: values.recipient,
      subject: values.subject,
      messageBody: editorRef ? editorRef.current.getContent() : undefined
    };

    const result = await makeApiRequest({
      url: '/api/issn-registry/messages/send',
      method: 'POST',
      values: sendMessageParams,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      // Redirect to the current request details page
      if (messageCode === 'form_handled') {
        return redirect(history, `/issn-registry/requests/${formId}`);
      }

      // Redirect to the requests list page
      return redirect(history, '/issn-registry/requests');
    }
  }

  const handleCancelSendingMessage = () => {
    history.goBack();
  };

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

  // Required to avoid focus issues on edit (component={renderTextField}})
  // NB! component={(props) => <RenderTextField {...props}/>} approach does not work here for some reason
  const renderTextField = (props) => <RenderTextField {...props} />;

  return (
    <Box className="sendMessageContainer">
      <Form
        onSubmit={handleApproveSendingMessage}
        initialValues={data}
        validate={validateSendMessage}
      >
        {({handleSubmit, valid}) => (
          <form onSubmit={handleSubmit}>
            <Typography variant="h5">
              <FormattedMessage id="messages.sendMessage" />
            </Typography>

            <div className="sendMessageLinks">
              {/* Link to the publishers page */}
              <Typography>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={`/issn-registry/publishers/${publisherId}`}
                  color="primary"
                  underline="always"
                >
                  <FormattedMessage id="common.publisherDetails.issn" />
                </Link>
              </Typography>

              {/* Link to the request form page */}
              {formId && (
                <Typography>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`/issn-registry/requests/${formId}`}
                    color="primary"
                    underline="always"
                  >
                    <FormattedMessage id="common.request" />
                  </Link>
                </Typography>
              )}
            </div>

            {/* Message type and language (non-editable fields) */}
            <Typography>
              <FormattedMessage id="messages.form.codes.title" />
              {': '}
              {messageCode && (
                <FormattedMessage id={`messages.form.codes.${messageCode}`} />
              )}
            </Typography>

            <Typography>
              <FormattedMessage id="form.common.language" />
              {': '}
              <FormattedMessage id={`common.${data.langCode}`} />
            </Typography>

            {/* Recipient email and message subject (editable fields) */}
            <div className="messageSubjectFields">
              <Field
                name="recipient"
                // See comment above about the renderTextField function
                component={renderTextField}
                variant="outlined"
                label={<FormattedMessage id="messages.recipient" />}
              />
              <Field
                name="subject"
                // See comment above about the renderTextField function
                component={renderTextField}
                variant="outlined"
                label={<FormattedMessage id="messages.subject" />}
              />
            </div>

            {/* Message body (tinyMCE editor) */}
            <BundledEditor
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={data.message}
            />

            {/* Buttons for approving/rejecting the process of sending a message */}
            <div className="sendMessageButtons">
              <Button disabled={!valid} type="submit" variant="contained" color="success">
                <FormattedMessage id="form.button.label.submit" />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCancelSendingMessage}
              >
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
            </div>
          </form>
        )}
      </Form>
    </Box>
  );
}

IssnMessageForm.propTypes = {
  userInfo: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
};

export default IssnMessageForm;
