import React from 'react';
import PropTypes from 'prop-types';

import {Form} from 'react-final-form';
import {Button} from '@mui/material';

import {FormattedMessage} from 'react-intl';

import {validate} from '/src/frontend/components/issn-registry/publishers/validate';

function IssnPublisherEditForm(props) {
  const {children, issnPublisher, handlePublisherUpdate, setIsEdit} = props;

  const handleCancel = () => {
    setIsEdit(false);
  };

  return (
    <>
      <Form
        onSubmit={handlePublisherUpdate}
        validate={validate}
        initialValues={issnPublisher}
      >
        {({handleSubmit, valid}) => (
          <form onSubmit={handleSubmit}>
            <div className="updateButtonsContainer">
              <Button type="submit" variant="contained" color="success" disabled={!valid}>
                <FormattedMessage id="form.button.label.update" />
              </Button>
              <Button variant="contained" color="error" onClick={handleCancel}>
                <FormattedMessage id="form.button.label.cancel" />
              </Button>
            </div>
            <div className="listItemSpinner">
              {children}
            </div>
          </form>
        )}
      </Form>
    </>
  );
}

IssnPublisherEditForm.propTypes = {
  children: PropTypes.node.isRequired,
  issnPublisher: PropTypes.object.isRequired,
  handlePublisherUpdate: PropTypes.func.isRequired,
  setIsEdit: PropTypes.func.isRequired
};

export default IssnPublisherEditForm;
