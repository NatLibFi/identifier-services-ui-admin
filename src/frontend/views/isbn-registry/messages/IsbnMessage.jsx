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

import {Grid, Link, Fab, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LinkIcon from '@mui/icons-material/Link';

import '/src/frontend/css/messages/message.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import ResendMessageModal from '/src/frontend/components/common/subComponents/modals/ResendMessageModal.jsx';

function IsbnMessage(props) {
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
    url: `/api/isbn-registry/messages/${id}`,
    method: 'GET',
    authenticationToken,
    dependencies: [id, authenticationToken],
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
    if (redirectToPublisherPageArray.includes(history.location.state.messageCode)) {
      return history.push({
        pathname: `/isbn-registry/publishers/${history.location.state.publisherId}`
      });
    }

    // If coming from publication request page - redirect to publication request page
    if (history.location.state.messageCode === 'identifier_created_isbn'
      || history.location.state.messageCode === 'identifier_created_ismn') {
      return history.push({
        pathname: `/isbn-registry/requests/publications/${history.location.state.publicationId}`
      });
    }

    // Disallow backwards travel to message send form page
    if (history.location.state?.sendMessage) {
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
        state: {searchBody: history.location.state.searchBody}
      });
    }

    // Discard state since it was used already if necessary
    history.replace({state: {}});
    history.goBack();
  };

  async function resendEmailMessageIsbn(recipient) {
    const result = await makeApiRequest({
      url: `/api/isbn-registry/messages/resend/${id}`,
      method: 'POST',
      values: {recipient},
      authenticationToken,
      setSnackbarMessage
    });

    if (result) {
      history.push({
        pathname: `/isbn-registry/messages/${result.id}`,
        state: {
          messageCode: history.location.state.messageCode,
          publisherId: history.location.state.publisherId,
          publicationId: history.location.state.publicationId
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
          <ArrowBackIcon />
        </Fab>
        <ResendMessageModal resendEmailMessage={resendEmailMessageIsbn} />
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
                  href={`/isbn-registry/requests/publications/${message.publicationId}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FormattedMessage id="common.publicationDetails" />
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
    </div>
  );

}

IsbnMessage.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(IsbnMessage);
