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

import React, {useState} from 'react';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';

import {
  Typography,
  Fab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

import BatchIdentifiersModal from '/src/frontend/components/isbn-registry/subComponents/modals/BatchIdentifiersModal.jsx';
import ListComponent from '/src/frontend/components/common/ListComponent.jsx';
import {MESSAGE_CODES} from '/src/frontend/components/common/form/constants';

function Batch({identifierBatch, intl, history, downloadBatch, deleteBatch}) {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handles back button click
  const handleGoBack = () => {
    history.goBack();
  };

  // Handles sending message
  const handleSendMessage = () => {
    const redirectRoute = '/isbn-registry/messages/form/send';
    const redirectMessageCode =
      identifierBatch.identifierType === 'ISBN'
        ? MESSAGE_CODES.SEND_LIST_ISBN
        : MESSAGE_CODES.SEND_LIST_ISMN;
    const redirectMessageState = {
      messageCode: redirectMessageCode,
      publisherId: identifierBatch.publisherId,
      identifierBatchId: identifierBatch.id
    };
    history.push(redirectRoute, redirectMessageState);
  };

  // Handles downloading batch data as a text file
  const handleDownload = () => {
    downloadBatch(identifierBatch.id);
  };

  // Handles deleting batch
  const handleDeleteBatch = () => {
    setLoading(true);
    deleteBatch(identifierBatch.id);
    setDeleteModalIsOpen(false);
  };

  const handleCloseBackdrop = () => {
    setLoading(false);
  };

  return (
    <>
      <div className="batchButtonsContainer">
        <div>
          <Fab
            color="secondary"
            size="small"
            title={intl.formatMessage({id: 'form.button.label.back'})}
            onClick={() => handleGoBack()}
          >
            <ArrowBackIcon />
          </Fab>
          <Button variant="outlined" onClick={handleSendMessage}>
            <FormattedMessage id="form.button.label.sendBatch" />
          </Button>
          <BatchIdentifiersModal
            identifiers={identifierBatch.identifiers}
            identifierCount={identifierBatch.identifierCount}
          />
          <Button
            variant="outlined"
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
          >
            <FormattedMessage id="form.button.label.downloadAsTextfile" />
          </Button>
        </div>
        {/* Pressing the delete button below causes opening of a confirmation Dialog */}
        <Fab
          color="warning"
          size="small"
          title={intl.formatMessage({id: 'form.button.label.delete'})}
          onClick={() => setDeleteModalIsOpen(true)}
        >
          <DeleteIcon />
        </Fab>
        <Dialog
          open={deleteModalIsOpen}
          onClose={() => setDeleteModalIsOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="modal.deleteBatch.title" />
          </DialogTitle>
          <DialogContent>
            <strong>
              <FormattedMessage id="modal.deleteBatch.approve" />
            </strong>
            <div>
              <FormattedMessage id="modal.deleteBatch.text" />
              <ul>
                {[1, 2, 3].map((item, index) => (
                  <li key={index}>
                    <FormattedMessage id={`modal.deleteBatch.condition${item}`} />
                  </li>
                ))}
              </ul>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalIsOpen(false)}>
              <FormattedMessage id="common.no" />
            </Button>
            <Button onClick={handleDeleteBatch}>
              <FormattedMessage id="common.yes" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Show loading spinner while deleting batch */}
      <Backdrop open={loading} onClick={handleCloseBackdrop}>
        <CircularProgress size={100} color="inherit" />
      </Backdrop>

      <div className="mainContainer">
        <div className="listComponentContainer">
          <Typography variant="h6" className="listComponentContainerHeader">
            <FormattedMessage id="ranges.batch.title" values={{part: '1/4'}} />
          </Typography>
          <ListComponent
            linkPath={`/isbn-registry/publishers/${identifierBatch.publisherId}`}
            fieldName="publisher"
            label={<FormattedMessage id="common.publisher.isbn" />}
            value={identifierBatch.publisherName}
          />
          <ListComponent
            fieldName="identifierType"
            label={<FormattedMessage id="ranges.identifierType" />}
            value={identifierBatch.identifierType ?? ''}
          />
        </div>
        <div className="listComponentContainer">
          <Typography variant="h6" className="listComponentContainerHeader">
            <FormattedMessage id="ranges.batch.title" values={{part: '2/4'}} />
          </Typography>
          <ListComponent
            fieldName="idInBatchCount"
            label={<FormattedMessage id="ranges.batch.ids" />}
            value={identifierBatch.identifierCount ?? ''}
          />
          <ListComponent
            fieldName="canceledCount"
            label={<FormattedMessage id="ranges.batch.canceled" />}
            value={identifierBatch.identifierCanceledCount}
          />
          <ListComponent
            fieldName="deletedCount"
            label={<FormattedMessage id="ranges.batch.deleted" />}
            value={identifierBatch.identifierDeletedCount}
          />
        </div>
        <div className="listComponentContainer">
          <Typography variant="h6" className="listComponentContainerHeader">
            <FormattedMessage id="ranges.batch.title" values={{part: '3/4'}} />
          </Typography>
          {identifierBatch.publicationId ? (
            <ListComponent
              linkPath={`/isbn-registry/requests/publications/${identifierBatch.publicationId}`}
              fieldName="publisher"
              label={<FormattedMessage id="common.publication" />}
              value={'link'}
            />
          ) : (
            <ListComponent
              fieldName="publisher"
              label={<FormattedMessage id="common.publication" />}
              value={intl.formatMessage({id: 'common.noValue'})}
            />
          )}
        </div>
        <div className="listComponentContainer">
          <Typography variant="h6" className="listComponentContainerHeader">
            <FormattedMessage id="ranges.batch.title" values={{part: '4/4'}} />
          </Typography>
          <ListComponent
            fieldName="timestamp"
            label={<FormattedMessage id="form.common.created" />}
            value={identifierBatch.created ?? ''}
          />
          <ListComponent
            fieldName="user"
            label={<FormattedMessage id="form.common.createdBy" />}
            value={identifierBatch.createdBy ?? ''}
          />
        </div>
      </div>
    </>
  );
}

Batch.propTypes = {
  identifierBatch: PropTypes.any.isRequired,
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  downloadBatch: PropTypes.func.isRequired,
  deleteBatch: PropTypes.func.isRequired
};

export default Batch;
