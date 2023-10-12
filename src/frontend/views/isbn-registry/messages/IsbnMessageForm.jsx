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

import '/src/frontend/css/forms/sendMessageForm.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import RenderTextField from '/src/frontend/components/common/form/render/RenderTextField.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import {validateSendMessage} from '/src/frontend/components/common/validation';

function IsbnMessageForm(props) {
  const {userInfo, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  // Early return if no location to read state from is defined
  if (!history || !history.location || history.action !== 'PUSH') {
    history.push('/errorpage');
    return;
  }

  const {
    messageCode,
    identifierBatchId,
    publisherId,
    publicationId
  } = history.location.state;

  const editorRef = useRef(null);

  const generateMessageParameters = {
    code: messageCode,
    publisherId,
    publicationId,
    identifierBatchId
  };

  // Generate a redirect link based on the message code
  const generateRedirectLink = ({messageCode, publisherId, publicationId}) => {
    const redirectToPublisherPage = [
      'publisher_registered_isbn',
      'publisher_registered_ismn',
      'big_publisher_isbn',
      'big_publisher_ismn'
    ];

    const redirectToPublicationPage = [
      'identifier_created_isbn',
      'identifier_created_ismn'
    ];

    // Redirect to the publisher's page
    if (redirectToPublisherPage.includes(messageCode)) {
      return `/isbn-registry/publishers/${publisherId}`;
    }

    // Redirect to the publication's page
    if (redirectToPublicationPage.includes(messageCode)) {
      return `/isbn-registry/requests/publications/${publicationId}`;
    }
  };

  const {data, loading, error} = useItem({
    url: '/api/isbn-registry/messages/loadtemplate',
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
      publicationId,
      batchId: identifierBatchId,
      langCode: data.langCode,
      messageTemplateId: data.templateId,
      recipient: values.recipient,
      subject: values.subject,
      messageBody: editorRef ? editorRef.current.getContent() : undefined
    };

    const result = await makeApiRequest({
      url: '/api/isbn-registry/messages/send',
      method: 'POST',
      values: sendMessageParams,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      // Redirect to the message details page
      history.push({
        pathname: generateRedirectLink({messageCode, publisherId, publicationId}),
        // Add values to the history state for the back button to work correctly
        state: {
          messageCode,
          publisherId,
          publicationId
        }
      });
    }
  }

  const handleCancelSendingMessage = () => {
    history.goBack();
  };

  // Required to avoid focus issues on edit (component={renderTextField}})
  // NB! component={(props) => <RenderTextField {...props}/>} approach does not work here for some reason
  const renderTextField = (props) => <RenderTextField {...props} />;

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
    <Box className="sendMessageContainer">
      <Form
        onSubmit={handleApproveSendingMessage}
        initialValues={data}
        validate={validateSendMessage}
      >
        {({handleSubmit, valid}) => (
          <form onSubmit={handleSubmit}>
            <Typography variant="h6">
              <FormattedMessage id="messages.sendMessage" />
            </Typography>

            <div className="sendMessageLinks">
              {/* Publisher link */}
              <Typography>
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={`/isbn-registry/publishers/${publisherId}`}
                  color="primary"
                  underline="always"
                >
                  <FormattedMessage id="common.publisherDetails.isbn" />
                </Link>
              </Typography>

              {/* Batch link (if exists) */}
              {identifierBatchId && (
                <Typography>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`/isbn-registry/identifierbatches/${identifierBatchId}`}
                    color="primary"
                    underline="always"
                  >
                    <FormattedMessage id="common.batch" />
                  </Link>
                </Typography>
              )}

              {/* Publication link (if exists) */}
              {publicationId && (
                <Typography>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`/isbn-registry/requests/publications/${publicationId}`}
                    color="primary"
                    underline="always"
                  >
                    <FormattedMessage id="common.publicationDetails" />
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
              <Button
                disabled={!valid}
                type="submit"
                variant="contained"
                color="success"
              >
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

IsbnMessageForm.propTypes = {
  userInfo: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired
};

export default IsbnMessageForm;
