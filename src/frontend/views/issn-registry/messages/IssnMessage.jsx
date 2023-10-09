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

import useItem from '/src/frontend/hooks/useItem';
import {makeApiRequest} from '/src/frontend/actions';
import {redirect} from '/src/frontend/actions/util';

import {Grid, Link, Fab, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';

import '/src/frontend/css/messages/message.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ResendMessageModal from '/src/frontend/components/common/subComponents/modals/ResendMessageModal.jsx';

function IssnMessage(props) {
  const {userInfo, match, history, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

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

  async function resendEmailMessageIssn(recipient) {
    const result = await makeApiRequest({
      url: `/api/issn-registry/messages/resend/${id}`,
      method: 'POST',
      values: {recipient},
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      // When originally coming from the request page (via modal) - redirect back to the request page
      if (history.location.state?.messageCode === 'formId') {
        return redirect(history, `/issn-registry/requests/${message.formId}`);
      }

      // When originally coming from the publisher page (via modal) - redirect back to the publisher page
      if (history.location.state?.messageCode === 'publisherId') {
        return redirect(history, `/issn-registry/publishers/${message.publisherId}`);
      }

      // Otherwise redirect to the messages list page
      redirect(history, '/issn-registry/messages');
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
          <ArrowBackIcon />
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
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={message.message}
            disabled={true}
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
