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

import React, {useMemo, useState} from 'react';

import {useAuth} from 'react-oidc-context';

import {FormattedMessage, useIntl} from 'react-intl';
import {Form} from 'react-final-form';

import {downloadFile} from '/src/frontend/actions';

import {Button, Typography, Box, CircularProgress} from '@mui/material';

import '/src/frontend/css/forms/groupMessageForm.css';

import RenderElement from '/src/frontend/components/common/form/RenderElement.jsx';
import {validate} from '/src/frontend/components/isbn-registry/groupMessages/validation';
import {GROUPMESSAGE_FORM_FIELDS} from '/src/frontend/components/isbn-registry/groupMessages/content';

function IsbnGroupMessageList() {
  const {user: {access_token: authenticationToken}} = useAuth();

  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  const handleDownloadEmailList = async values => {
    setLoading(true);
    const queryValues = {
      identifierType: values.groupIdentifier,
      category: Number(values.groupCategory),
      langCode: values.groupLanguage,
      format: 'txt'
    };

    await downloadFile({
      url: '/api/isbn-registry/publishers/download-email-list',
      method: 'POST',
      requestBody: queryValues,
      authenticationToken,
      downloadName: `publisher-${values.groupIdentifier}-category${values.groupCategory}-${values.groupLanguage.substring(0, 2)}-emails.txt`
    });

    setLoading(false);
  };

  // Required to avoid focus issues on edit
  const dataComponent = useMemo(() => <RenderElement array={GROUPMESSAGE_FORM_FIELDS} intl={intl} />, []);

  return (
    <Box>
      <Form
        onSubmit={handleDownloadEmailList}
        validate={validate}
      >
        {({handleSubmit, valid}) => (
          <form className='groupMessageForm' onSubmit={handleSubmit} >
            <Typography variant="h4">
              <FormattedMessage id="common.groupmessages" />
            </Typography>

            <Typography variant="h5">
              <FormattedMessage id="form.groupmessages.downloademail" />
            </Typography>

            <div className='groupMessageFieldsContainer'>
              {dataComponent}
            </div>

            <Button
              type="submit"
              disabled={!valid}
              variant="contained"
              color="success"
            >
              <FormattedMessage id="common.download" />
            </Button>

            {loading &&
              <div className='groupMessageSpinner'>
                <Typography>
                  <FormattedMessage id='statistics.generating' />
                </Typography>
                <CircularProgress />
              </div>
            }
          </form>
        )}
      </Form>
    </Box>
  );
}

export default IsbnGroupMessageList;
