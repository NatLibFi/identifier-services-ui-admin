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
import {withRouter} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';

import {Grid, Link, Fab, Typography} from '@mui/material';
import {ArrowBack, Link as LinkIcon} from '@mui/icons-material';

import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import '/src/frontend/css/messages/message.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ResendMessageModal from '/src/frontend/components/common/subComponents/modals/ResendMessageModal.jsx';

function IssnMessage(props) {
  const {userInfo: {authenticationToken}, match, history, setSnackbarMessage} = props;

  // ID of a current template
  const {id} = match.params;
  const editorRef = useRef(null);

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
      formId: message.formId ?? undefined,
      langCode: message.langCode,
      messageTemplateId: message.messageTemplateId,
      subject: message.subject,
      // new data
      recipient,
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
      // Redirect to the message details page
      redirect(history, `/issn-registry/messages/${result.id}`);
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
        <ResendMessageModal resendEmailMessage={resendEmailMessageIssn} />
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
          />
        </div>
      </div>
    </div>
  );
}

IssnMessage.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IssnMessage);
