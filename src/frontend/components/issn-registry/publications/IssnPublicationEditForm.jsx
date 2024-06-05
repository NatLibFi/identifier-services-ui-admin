import React from 'react';
import PropTypes from 'prop-types';

import {useAuth} from 'react-oidc-context';

import {Form} from 'react-final-form';

import {FormattedMessage} from 'react-intl';
import {Button} from '@mui/material';

import {validate} from '/src/frontend/components/issn-registry/publications/validate';


function IssnPublicationEditForm(props) {
  const {
    children,
    issnPublication,
    handleUpdatePublication,
    setIsEdit
  } = props;

  // NB: Hook is used here to avoid re-renders which would happen if passing token/handler function
  // through props
  const {user: {access_token: authenticationToken}} = useAuth();

  async function handleSubmit(values) {
    return handleUpdatePublication(values, authenticationToken);
  }

  const handleCancel = () => {
    setIsEdit(false);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      initialValues={issnPublication}
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
  );
}

IssnPublicationEditForm.propTypes = {
  children: PropTypes.node.isRequired,
  issnPublication: PropTypes.object.isRequired,
  handleUpdatePublication: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired
};

export default IssnPublicationEditForm;
