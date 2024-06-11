import React from 'react';
import PropTypes from 'prop-types';

import {useAuth} from 'react-oidc-context';
import {useHistory} from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

import {
  Button,
  Typography,
  Box,
  Modal
} from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import useAppStateDispatch from '/src/frontend/hooks/useAppStateDispatch';

import {makeApiRequest} from '/src/frontend/actions';


function IsbnPublicationRequestIdentifierGrantModal(props) {
  const {
    handleCancelGrantAnId,
    identifierGrantModalIsOpen,
    identifierType,
    publicationRequest,
    setModalOpen
  } = props;

  const history = useHistory();
  const {user: {access_token: authenticationToken}} = useAuth();
  const appStateDispatch = useAppStateDispatch();
  const setSnackbarMessage = (snackbarMessage) => appStateDispatch({snackbarMessage});

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  async function handleSubmitAnId() {
    const url = `/api/isbn-registry/identifierbatches/${identifierType}`;
    const values = {publisherId: publicationRequest.publisherId, publicationId: publicationRequest.id};
    const redirectRoute = `/isbn-registry/requests/publications/${publicationRequest.id}`;

    await makeApiRequest({
      url,
      method: 'POST',
      values,
      authenticationToken,
      history,
      redirectRoute,
      setSnackbarMessage
    });

    handleCloseModal();
  }

  return (
    (
      <div className="grantAnIdButtonsContainer">
        <Button
          variant="contained"
          color="primary"
          endIcon={
            identifierType ? (
              identifierType === 'isbn' ? (
                <BookIcon />
              ) : (
                <MusicNoteIcon />
              )
            ) : null
          }
          disabled={!identifierType}
          onClick={handleOpenModal}
        >
          {identifierType ? (
            identifierType === 'isbn' ? (
              <FormattedMessage
                id="form.button.label.grant"
                values={{type: 'ISBN'}}
              />
            ) : (
              <FormattedMessage
                id="form.button.label.grant"
                values={{type: 'ISMN'}}
              />
            )
          ) : (
            <FormattedMessage id="form.button.label.submit" />
          )}
        </Button>
        <Button variant="contained" color="error" onClick={handleCancelGrantAnId}>
          <FormattedMessage id="form.button.label.cancel" />
        </Button>
        <Modal
          open={identifierGrantModalIsOpen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          onClose={handleCloseModal}
        >
          <Box className="grantAnIdModal">
            <Typography variant="h5">
              Valittu julkaisija: {publicationRequest.publisherName}
            </Typography>
            <Typography variant="h5">
              <FormattedMessage id="request.publication.grantId" />
            </Typography>
            {[...publicationRequest.fileformat].map((v) => (
              <Typography key={v}>
                <em>
                  <FormattedMessage id={`form.fileFormat.${v.toLowerCase()}`} />
                </em>
              </Typography>
            ))}
            <br />
            {[...publicationRequest.type].map((v) => (
              <Typography key={v}>
                <em>
                  <FormattedMessage id={`form.printFormat.${v.toLowerCase()}`} />
                </em>
              </Typography>
            ))}
            <div>
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmitAnId}
              >
                <FormattedMessage id="form.button.label.approve" />
              </Button>
              <Button variant="contained" color="error" onClick={handleCloseModal}>
                <FormattedMessage id="form.button.label.reject" />
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    )
  );
}

IsbnPublicationRequestIdentifierGrantModal.propTypes = {
  handleCancelGrantAnId: PropTypes.func.isRequired,
  identifierGrantModalIsOpen: PropTypes.bool.isRequired,
  identifierType: PropTypes.string,
  publicationRequest: PropTypes.object.isRequired,
  setModalOpen: PropTypes.func.isRequired
};

export default IsbnPublicationRequestIdentifierGrantModal;
