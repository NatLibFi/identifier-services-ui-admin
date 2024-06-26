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

import {useAuth} from 'react-oidc-context';
import {useHistory, useParams, withRouter} from 'react-router-dom';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';

import {FormattedMessage} from 'react-intl';
import moment from 'moment';

import {Grid, Link, Fab, Typography} from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';

import {makeApiRequest} from '/src/frontend/actions';

import '/src/frontend/css/messages/message.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ResendMessageModal from '/src/frontend/components/common/subComponents/modals/ResendMessageModal.jsx';

function IsbnMessage() {
  const {user: {access_token: authenticationToken}} = useAuth();
  const history = useHistory();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const {
    messageCode,
    publisherId,
    publicationId,
    searchBody,
    sendMessage
  } = history.location.state;

  // ID of a current template
  const params = useParams();
  const {id} = params;
  const editorRef = useRef(null);
  const resendEditorRef = useRef(null);

  const {
    data: message,
    loading,
    error
  } = useItem({
    url: `/api/isbn-registry/messages/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Handles back button click
  const handleGoBack = () => {
    const redirectToPublisherPageArray = [
      'publisher_registered_isbn',
      'publisher_registered_ismn',
      'big_publisher_isbn',
      'big_publisher_ismn'
    ];

    // If coming from publisher registration or from batch page - redirect to publisher page
    if (redirectToPublisherPageArray.includes(messageCode)) {
      return history.push({
        pathname: `/isbn-registry/publishers/${publisherId}`
      });
    }

    // If coming from publication request page - redirect to publication request page
    if (messageCode === 'identifier_created_isbn'
      || messageCode === 'identifier_created_ismn') {
      return history.push({
        pathname: `/isbn-registry/requests/publications/${publicationId}`
      });
    }

    // Disallow backwards travel to message send form page
    if (sendMessage) {
      // Empty state
      history.replace({state: {}});
      const redirectRoute = message.publicationId
        ? `/isbn-registry/requests/publications/${message.publicationId}`
        : `/isbn-registry/publishers/${message.publisherId}`;
      return history.push(redirectRoute);
    }

    // If coming from search
    if (history.location?.state?.searchBody) {
      return history.push({
        pathname: '/isbn-registry/messages',
        state: {searchBody: searchBody}
      });
    }

    // Discard state since it was used already if necessary
    history.replace({state: {}});
    history.goBack();
  };

  // Handles resending a message with a new recipient and message body
  async function resendEmailMessageIsbn(recipient) {
    const sendMessageParams = {
      // data from original message
      publisherId: message.publisherId,
      publicationId: message.publicationId,
      batchId: message.batchId,
      langCode: message.langCode,
      messageTemplateId: message.messageTemplateId,
      subject: message.subject,
      // new data
      recipient,
      messageBody: resendEditorRef ? resendEditorRef.current.getContent() : undefined
    };

    // Add publicationId and batchId if they exist
    if (message.publicationId) {
      sendMessageParams.publicationId = message.publicationId;
    }

    if (message.batchId) {
      sendMessageParams.batchId = message.batchId;
    }

    const result = await makeApiRequest({
      url: '/api/isbn-registry/messages/send',
      method: 'POST',
      values: sendMessageParams,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      const redirectToPublisherPage = [
        'publisher_message_modal',
        'publisher_batch_modal',
        'publisher_publications_modal'
      ];

      // When coming from the publisher's modals - redirect back to the publisher's page
      if (redirectToPublisherPage.includes(messageCode)) {
        return history.push({
          pathname: `/isbn-registry/publishers/${publisherId}`,
          state: {
            messageCode: messageCode,
            publisherId: publisherId
          }
        });
      }

      // Base case - redirect back to the messages list page
      history.push({
        pathname: '/isbn-registry/messages/',
        state: {
          messageCode: messageCode,
          publisherId: publisherId,
          publicationId: publicationId
        }
      });
    }
  }

  // Show spinner while fetching data
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
    <div className="messageContainer">
      <div className="messageButtonsContainer">
        <Fab
          color="secondary"
          size="small"
          title="Takaisin"
          className="iconButton"
          onClick={() => handleGoBack()}
        >
          <ArrowBack />
        </Fab>
        <ResendMessageModal
          resendEmailMessage={resendEmailMessageIsbn}
          message={message}
          editorRef={resendEditorRef}
          registry='isbn-registry'
        />
      </div>
      <div>
        <div className="messageBoxContainer">
          <Grid container>
            <Grid item xs={2}>
              <FormattedMessage id="form.common.email" />:
            </Grid>
            <Grid item xs={10}>
              {message.recipient}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={2}>
              <FormattedMessage id="common.publisher.isbn" />:
            </Grid>
            <Grid item xs={10}>
              {message.publisherId && message.publisherId !== 0 ? (
                <Link
                  className="messageLink"
                  href={`/isbn-registry/publishers/${message.publisherId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FormattedMessage id="common.publisherDetails.isbn" /> <LinkIcon />
                </Link>
              ) : (
                <FormattedMessage id="common.noValue" />
              )}
            </Grid>
          </Grid>
          {message.batchId && message.batchId !== 0 && !message.publicationId && (
            <Grid container>
              <Grid item xs={2}>
                <FormattedMessage id="common.batch" />:
              </Grid>
              <Grid item xs={10}>
                <Link
                  className="messageLink"
                  href={`/isbn-registry/identifierbatches/${message.batchId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FormattedMessage id="common.batchDetails" /> <LinkIcon />
                </Link>
              </Grid>
            </Grid>
          )}
          <Grid container>
            <Grid item xs={2}>
              <FormattedMessage id="common.publication" />:
            </Grid>
            <Grid item xs={10}>
              {message.publicationId && message.publicationId !== 0 ? (
                <Link
                  className="messageLink"
                  href={`/isbn-registry/requests/publications/${message.publicationId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FormattedMessage id="common.publicationDetails" /> <LinkIcon />
                </Link>
              ) : (
                <FormattedMessage id="common.noValue" />
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={2}>
              <FormattedMessage id="messages.sent" />:
            </Grid>
            <Grid item xs={10}>
              {moment(message.sent).format('LLL')} ({message.sentBy})
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={2}>
              <FormattedMessage id="messages.subject" />:
            </Grid>
            <Grid item xs={10}>
              {message.subject}
            </Grid>
          </Grid>
          <div className="messageTextContainer">
            <BundledEditor
              onInit={(_evt, editor) => (editorRef.current = editor)}
              initialValue={message.message}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(IsbnMessage);
