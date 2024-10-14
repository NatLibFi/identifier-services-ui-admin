import React from 'react';
import PropTypes from 'prop-types';

import {useAuth} from 'react-oidc-context';

import {FormattedMessage} from 'react-intl';

import {Form} from 'react-final-form';
import {Button, Typography} from '@mui/material';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import FormEditErrorCard from '/src/frontend/components/isbn-registry/subComponents/cards/FormEditErrorCard.jsx';

import {updateEntry} from '/src/frontend/actions';
import {formatPublicationValues, formatPublicationRequestValues} from '/src/frontend/components/isbn-registry/publicationRequests/utils';
import {validate} from '/src/frontend/components/isbn-registry/publicationRequests/validate';
import {PUBLICATION_TYPES} from '/src/frontend/components/common/form/constants';


function IsbnPublicationRequestEditForm(props) {
  const {
    children,
    publicationRequest,
    setIsEdit,
    setPublicationRequest
  } = props;

  const {user: {access_token: authenticationToken}} = useAuth();

  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  function handleCancel() {
    setIsEdit(false);
  }

  async function handlePublicationRequestUpdate(values) {
    // Check whether the publication is a confirmed publication or a publication request
    const publicationIsConfirmed =
      values.publicationIdentifierPrint !== '' ||
      values.publicationIdentifierElectronical !== '';

    // Use different format function depending on the publication status (confirmed or not)
    const updateValues = publicationIsConfirmed
      ? formatPublicationValues(values)
      : formatPublicationRequestValues(values);

    const updateResult = await updateEntry({
      url: `/api/isbn-registry/requests/publications/${publicationRequest.id}`,
      values: updateValues,
      authenticationToken,
      setSnackbarMessage,
      keepIssn: true
    });

    if (updateResult) {
      setPublicationRequest(updateResult);
    }

    setIsEdit(false);
  }

  return (
    <div className="listItem">
      <Typography variant="h2" className="titleTopSticky normalTitle">
        {publicationRequest?.title ?? ''} -{' '}
        {publicationRequest?.publicationType !== PUBLICATION_TYPES.SHEET_MUSIC
          ? 'ISBN'
          : 'ISMN'}
        -
        <FormattedMessage id="common.requestDetails" />
      </Typography>
      <Form
        onSubmit={handlePublicationRequestUpdate}
        validate={validate}
        initialValues={publicationRequest}
      >
        {({handleSubmit, valid, errors}) => (
          <form onSubmit={handleSubmit}>
            <div className="updateContainer">
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
              {/* Display an error message if the form is not valid */}
              <FormEditErrorCard valid={valid} errors={errors} />
            </div>
            <div className="listItemSpinner">{children}</div>
          </form>
        )}
      </Form>
    </div>
  );
}

IsbnPublicationRequestEditForm.propTypes = {
  children: PropTypes.node.isRequired,
  publicationRequest: PropTypes.object.isRequired,
  setIsEdit: PropTypes.func.isRequired,
  setPublicationRequest: PropTypes.func.isRequired
};

export default IsbnPublicationRequestEditForm;
