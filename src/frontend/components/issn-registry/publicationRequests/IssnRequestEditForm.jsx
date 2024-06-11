import React from 'react';
import PropTypes from 'prop-types';

import {Form} from 'react-final-form';
import {Button} from '@mui/material';

import {useAuth} from 'react-oidc-context';

import {FormattedMessage} from 'react-intl';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import {updateEntry} from '/src/frontend/actions';
import {validate} from '/src/frontend/components/issn-registry/publicationRequests/validate';

function IssnRequestEditForm(props) {
  const {
    children,
    issnRequest,
    setIsEdit,
    setIssnRequest
  } = props;

  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  /* Handles canceling of the editing process */
  const handleCancel = () => {
    setIsEdit(false);
  };

  /* Handles updating of the current request */
  async function handlePublicationRequestUpdate(values) {
    // publisher id should not be sent to the API
    const {publisherId, publisherName, ...updateValues} = values; // eslint-disable-line no-unused-vars

    const updateResult = await updateEntry({
      url: `/api/issn-registry/requests/${issnRequest.id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage
    });

    if (updateResult) {
      setIssnRequest(updateResult);
    }

    setIsEdit(false);
  }

  return (
    <>
      <Form
        onSubmit={handlePublicationRequestUpdate}
        initialValues={issnRequest}
        validate={validate}
      >
        {({handleSubmit, valid}) => (
          <form onSubmit={handleSubmit}>
            <div className="updateButtonsContainer">
              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={!valid}
              >
                <FormattedMessage id="form.button.label.update" />
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
            </div>
            <div className="listItemSpinner">{children}</div>
          </form>
        )}
      </Form>
    </>
  );
}

IssnRequestEditForm.propTypes = {
  children: PropTypes.node.isRequired,
  issnRequest: PropTypes.object.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setIssnRequest: PropTypes.func.isRequired
};

export default IssnRequestEditForm;
