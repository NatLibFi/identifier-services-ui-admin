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
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';
import moment from 'moment';
import {Modal, Box, Typography, Button} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';
import Spinner from '/src/frontend/components/common/Spinner.jsx';

function IssnRequestArchiveModal({formId, userInfo}) {
  const {authenticationToken} = userInfo;

  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)

  const {data, loading, error} = useItem({
    url: '/api/issn-registry/archived-requests/search',
    method: 'POST',
    body: {formId},
    dependencies: [formId, isModalOpen],
    prefetch: false,
    fetchOnce: true,
    requireAuth: true,
    authenticationToken,
    modalIsUsed: true,
    isModalOpen
  });

  const component = getComponent();

  function getComponent() {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <Typography>Could not fetch data due to API error</Typography>;
    }

    return (
      <>
        <Typography variant="h5">
          <FormattedMessage id="modal.issn.archive.record" />
        </Typography>
        <div className="archiveRecordContainer">
          <div>
            <Typography>
              <FormattedMessage id="common.publisher.issn" />:
            </Typography>
            <p>{data.publisher}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="modal.issn.archive.amount" />:
            </Typography>{' '}
            <p>{data.publicationCount}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.contactPerson" />:
            </Typography>{' '}
            <p>{data.contactPerson}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.address" />:
            </Typography>{' '}
            <p>{data.address}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.city" />:
            </Typography>{' '}
            <p>{data.city}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.zip" />:
            </Typography>{' '}
            <p>{data.zip}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.email" />:
            </Typography>{' '}
            <p>{data.email}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.phone" />:
            </Typography>{' '}
            <p>{data.phone}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.language" />:
            </Typography>{' '}
            <p>
              <FormattedMessage id={`common.${data.langCode}`} />
            </p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="common.request" />:
            </Typography>{' '}
            <p>{data.formId}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="modal.issn.archive.id" />:
            </Typography>{' '}
            <p>{data.id}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="modal.issn.archive.oldId" />:
            </Typography>{' '}
            <p>{data.oldId ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.created" />:
            </Typography>{' '}
            <p>{moment(data.created).format('LLL')}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.createdBy" />:
            </Typography>{' '}
            <p>{data.createdBy}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Button
        className="requestButton"
        variant="outlined"
        color="primary"
        onClick={() => setIsModalOpen(true)}
      >
        <FormattedMessage id="modal.issn.archive.record" />
      </Button>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box className="marcModal">{component}</Box>
      </Modal>
    </>
  );
}

IssnRequestArchiveModal.propTypes = {
  formId: PropTypes.number.isRequired,
  userInfo: PropTypes.object.isRequired
};

export default IssnRequestArchiveModal;
