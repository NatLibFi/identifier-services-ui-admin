import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {FormattedMessage} from 'react-intl';

import {Typography, Backdrop} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import IsbnPublicationRequestButtonRow from '/src/frontend/components/isbn-registry/publicationRequests/IsbnPublicationRequestButtonRow.jsx';
import IsbnPublicationRequestIdentifierGrantModal from '/src/frontend/components/isbn-registry/subComponents/modals/IsbnPublicationRequestIdentifierGrantModal.jsx';

import {PUBLICATION_TYPES} from '/src/frontend/components/common/form/constants';


function IsbnPublicationRequestDisplay({publicationRequest, setIsEdit, children}) {
  // State for the spinner shown while saving to Melinda or downloading MARC
  const [showSpinner, setShowSpinner] = useState(false);

  // State for selecting the type of an id to be granted
  const [identifierType, setIdentifierType] = useState('');

  // State for the modal window for generating identifierbatch for the publication
  const [identifierGrantModalIsOpen, setIdentifierGrantModalOpen] = useState(false);
  const [isGrantingIdentifiers, setIsGrantingIdentifiers] = useState(false);

  // Handles canceling of the granting an id process
  const handleCancelGrantAnId = () => {
    setIsGrantingIdentifiers(false);
    setIdentifierType('');
  };


  return (
    <div>
      <Typography variant="h5" className="titleTopSticky">
        {publicationRequest?.title ?? ''} -{' '}
        {publicationRequest?.publicationType !== PUBLICATION_TYPES.SHEET_MUSIC
          ? 'ISBN'
          : 'ISMN'}
        -
        <FormattedMessage id="common.requestDetails" />
      </Typography>
      <div className="requestButtonsContainer">
        {isGrantingIdentifiers && <IsbnPublicationRequestIdentifierGrantModal
          handleCancelGrantAnId={handleCancelGrantAnId}
          identifierGrantModalIsOpen={identifierGrantModalIsOpen}
          identifierType={identifierType}
          publicationRequest={publicationRequest}
          setModalOpen={setIdentifierGrantModalOpen}
        />}
        {!isGrantingIdentifiers && <IsbnPublicationRequestButtonRow
          publicationRequest={publicationRequest}
          setIdentifierType={setIdentifierType}
          setIsEdit={setIsEdit}
          setIsGrantingIdentifiers={setIsGrantingIdentifiers}
          setShowSpinner={setShowSpinner}
        />}
      </div>

      {/* Show loading spinner during Saving to Melinda and downloading MARC */}
      <Backdrop open={showSpinner} onClick={() => setShowSpinner(false)} >
        <CircularProgress size={100} color="inherit" />
      </Backdrop >
      {children}
    </div>
  );
}

IsbnPublicationRequestDisplay.propTypes = {
  children: PropTypes.node.isRequired,
  publicationRequest: PropTypes.object.isRequired,
  setIsEdit: PropTypes.func.isRequired
};

export default IsbnPublicationRequestDisplay;
