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
import {FormattedMessage, useIntl} from 'react-intl';
import {Form} from 'react-final-form';
import {Button, Typography} from '@mui/material';

import {makeApiRequest} from '/src/frontend/actions';
import useList from '/src/frontend/hooks/useList';

import '/src/frontend/css/forms/common.css';
import '/src/frontend/css/forms/templateCreationForm.css';

import BundledEditor from '/src/frontend/components/common/BundledEditor.jsx';
import {element} from '/src/frontend/components/common/utils';
import MessageTemplateInfoCard from '/src/frontend/components/issn-registry/subComponents/MessageTemplateInfoCard.jsx';
import {validate} from '/src/frontend/components/common/form/validation/templateCreationValidation';

function IssnMessageTemplateForm(props) {
  const {history, userInfo, setSnackbarMessage} = props;
  const {authenticationToken} = userInfo;

  const {data: messageTypesList} = useList({
    url: '/api/issn-registry/messagetypes',
    method: 'GET',
    authenticationToken,
    prefetch: true,
    fetchOnce: true,
    requireAuth: true,
    modalIsUsed: false
  });

  // Content of the template creation form
  const fieldArray = [
    {
      name: 'name',
      type: 'text',
      label: <FormattedMessage id="messages.templates.form.templateName" />,
      width: 'half'
    },
    {
      name: 'subject',
      type: 'text',
      label: <FormattedMessage id="messages.templates.form.subject" />,
      width: 'half'
    },
    {
      name: 'langCode',
      type: 'select',
      label: 'messages.templates.form.selectLanguage',
      width: 'half',
      options: [
        {label: '', value: ''},
        {label: 'Suomi', value: 'fi-FI'},
        {label: 'English ', value: 'en-GB'},
        {label: 'Svenska', value: 'sv-SE'}
      ]
    },
    {
      name: 'messageTypeId',
      type: 'select',
      label: 'messages.templates.form.messageType',
      width: 'half',
      options: [
        {label: '', value: ''},
        ...messageTypesList.map((item) => ({label: item.name, value: item.id}))
      ]
    }
  ];

  const intl = useIntl();
  const editorRef = useRef(null);

  async function handleCreateTemplate(values) {
    const formattedDoc = {
      ...values,
      message: editorRef ? editorRef.current.getContent() : undefined
    };

    await makeApiRequest({
      url: '/api/issn-registry/messagetemplates',
      method: 'POST',
      values: formattedDoc,
      authenticationToken,
      setSnackbarMessage,
      history,
      redirectRoute: '/issn-registry/messagetemplates'
    });
  }

  // Handles cancel submitting the form, redirects to the previous page
  function handleCancel() {
    history.push('/issn-registry/messagetemplates');
  }

  return (
    <div>
      <Form onSubmit={handleCreateTemplate} validate={validate}>
        {({handleSubmit, pristine, valid}) => (
          <form className="templateCreationContainer" onSubmit={handleSubmit}>
            <Typography variant="h5">
              <FormattedMessage id="messages.templates.create" />
            </Typography>
            <div className="templateCreationEditableFields">
              {fieldArray.map((item) => (
                <div
                  key={item.name}
                  className={item.width === 'full' ? 'templateCreationTextField' : ''}
                >
                  {element({item, intl})}
                </div>
              ))}
            </div>
            <BundledEditor
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={''}
            />
            <div className="templateFormButtons">
              <Button
                disabled={pristine || !valid}
                type="submit"
                variant="contained"
                color="success"
              >
                <FormattedMessage id="form.button.label.create" />
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={handleCancel}
              >
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
            </div>
          </form>
        )}
      </Form>
      <MessageTemplateInfoCard />
    </div>
  );
}

IssnMessageTemplateForm.propTypes = {
  userInfo: PropTypes.object.isRequired,
  setSnackbarMessage: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default IssnMessageTemplateForm;
