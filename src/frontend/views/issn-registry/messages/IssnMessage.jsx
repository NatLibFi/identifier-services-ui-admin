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
import {FormattedMessage} from 'react-intl';
import moment from 'moment';

import {Grid, Link, Fab, Typography} from '@mui/material';
import {ArrowBack, Link as LinkIcon} from '@mui/icons-material';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';
import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/messages/message.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ResendMessageModal from '/src/frontend/components/common/subComponents/modals/ResendMessageModal.jsx';

function IssnMessage() {
  const history = useHistory();
  const params = useParams();
  const {user: {access_token: authenticationToken}} = useAuth();

  const {id} = params;
  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const editorRef = useRef(null);
  const resendEditorRef = useRef(null);

  const {
    data: message,
    loading,
    error
  } = useItem({
    url: `/api/issn-registry/messages/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id],
    prefetch: true,
    fetchOnce: false,
    requireAuth: true
  });

  // Handles back button click
  const handleGoBack = () => {
    // Disallow backwards travel to message send form page
    if (history.location.state?.sendMessage) {
      // Empty state
      history.replace({state: {}});
      return history.push(`/issn-registry/publishers/${message.publisherId}`);
    }

    // If coming from search
    if (history.location?.state?.searchBody) {
      return history.push({
        pathname: '/issn-registry/messages',
        state: {searchBody: history.location.state.searchBody}
      });
    }

    // Discard state since it was used already if necessary
    history.replace({state: {}});
    history.goBack();
  };

  // Handles resending a message with a new recipient and message body
  async function resendEmailMessageIssn(recipient) {
    const sendMessageParams = {
      // data from original message
      publisherId: message.publisherId,
      formId: message.formId,
      messageTemplateId: message.messageTemplateId,
      langCode: message.langCode,
      subject: message.subject,
      // new data
      recipient,
      messageBody: resendEditorRef ? resendEditorRef.current.getContent() : undefined
    };

    const result = await makeApiRequest({
      url: '/api/issn-registry/messages/send',
      method: 'POST',
      values: sendMessageParams,
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      const {messageCode} = history?.location?.state || {};

      // When originally coming from the request page (via modal) - redirect back to the request page
      if (messageCode === 'formId') {
        return redirect(history, `/issn-registry/requests/${message.formId}`);
      }

      // When originally coming from the publisher page (via modal) - redirect back to the publisher page
      if (messageCode === 'publisherId') {
        return redirect(history, `/issn-registry/publishers/${message.publisherId}`);
      }

      // Otherwise redirect to the messages list page
      return redirect(history, '/issn-registry/messages');
    }
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
          resendEmailMessage={resendEmailMessageIssn}
          message={message}
          editorRef={resendEditorRef}
          registry='issn-registry'
        />
      </div>
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
            <FormattedMessage id="common.publisher.issn" />:
          </Grid>
          <Grid item xs={10}>
            {message.publisherId && message.publisherId !== 0 ? (
              <Link
                className="messageLink"
                href={`/issn-registry/publishers/${message.publisherId}`}
                target="_blank"
                rel="noreferrer"
              >
                <FormattedMessage id="common.publisherDetails.issn" /> <LinkIcon />
              </Link>
            ) : (
              <FormattedMessage id="common.noValue" />
            )}
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={2}>
            <FormattedMessage id="common.request" />:
          </Grid>
          <Grid item xs={10}>
            {message.formId && message.formId !== 0 ? (
              <Link
                className="messageLink"
                href={`/issn-registry/requests/${message.formId}`}
                target="_blank"
                rel="noreferrer"
              >
                <FormattedMessage id="common.requestDetails" /> <LinkIcon />
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
  );
}

export default withRouter(IssnMessage);
