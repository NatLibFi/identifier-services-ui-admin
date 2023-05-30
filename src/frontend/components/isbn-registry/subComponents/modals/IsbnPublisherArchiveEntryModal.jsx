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
import {FormattedMessage, useIntl} from 'react-intl';
import moment from 'moment/moment';

import {Button, Modal, Box, Typography} from '@mui/material';

import useItem from '/src/frontend/hooks/useItem';

import '/src/frontend/css/common.css';
import '/src/frontend/css/subComponents/modals.css';

import Spinner from '/src/frontend/components/common/Spinner.jsx';
import {classificationCodes} from '/src/frontend/components/common/form/constants';

function IsbnPublisherArchiveEntryModal({authenticationToken, publisherId}) {
  const intl = useIntl();

  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)
  const {data, loading, error} = useItem({
    url: '/api/isbn-registry/publisher-archives/query',
    method: 'POST',
    body: {publisherId},
    authenticationToken,
    dependencies: [isModalOpen],
    prefetch: false,
    fetchOnce: true,
    requireAuth: true
  });

  // Event handlers for the modal window (open/closed)
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const component = getComponent();

  function getComponent() {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      if (error.status === 404) {
        return (
          <Typography>Publisher does not have an archive entry in the database</Typography>
        );
      }
      return (
        <Typography>Could not fetch data due to API error</Typography>
      );
    }

    return (
      <div>
        <Typography variant="h5">
          <FormattedMessage id="form.common.archiveRecord" />
        </Typography>
        <div className="archiveRecordContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.name" />
            </Typography>{' '}
            <p>{data.officialName ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.otherNames" />
            </Typography>{' '}
            <p>{data.otherNames ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.address" />
            </Typography>{' '}
            <p>{data.address ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.zip" />
            </Typography>{' '}
            <p>{data.zip ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.city" />
            </Typography>{' '}
            <p>{data.city ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.phone" />
            </Typography>{' '}
            <p>{data.phone ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.url" />
            </Typography>{' '}
            <p>{data.www ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.contactPerson" />
            </Typography>{' '}
            <p>{data.contactPerson ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.currentYear" />
            </Typography>{' '}
            <p>{data.frequencyCurrent ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.nextYear" />
            </Typography>{' '}
            <p>{data.frequencyNext ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.affiliateOf" />
            </Typography>{' '}
            <p>{data.affiliateOf ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.affiliates" />
            </Typography>{' '}
            <p>{data.affiliates ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.distributorOf" />
            </Typography>{' '}
            <p>{data.distributorOf ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.distributors" />
            </Typography>{' '}
            <p>{data.distributors ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.classificationCodes" />
            </Typography>{' '}
            {data.classification ? (
              provideTranslation(data.classification, intl)
            ) : (
              <p>-</p>
            )}
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.classificationOther" />
            </Typography>{' '}
            <p>{data.classificationOther ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.confirmation" />
            </Typography>{' '}
            <p>{data.confirmation ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.created" />:
            </Typography>{' '}
            <p>{data.created ? moment(data.created).format('LLL') : '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.createdBy" />:
            </Typography>{' '}
            <p>{data.createdBy ?? '-'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Button that opens a modal */}
      <Button
        className="buttons"
        variant="outlined"
        color="primary"
        onClick={handleOpenModal}
      >
        <FormattedMessage id="form.common.archiveRecord" />
      </Button>

      {/* Content of a modal component */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box className="modal">{component}</Box>
      </Modal>
    </>
  );
}

function provideTranslation(codes, intl) {
  if (!Array.isArray(codes)) {
    return <p>Invalid values</p>;
  }

  if (codes.length === 0) {
    return <p>-</p>;
  }

  return <p>{codes.map(translateCode).join(', ')}</p>;

  function translateCode(code) {
    const translationItem = classificationCodes.find((v) => v.value === code);
    if (!translationItem) {
      return 'unknown code';
    }

    return intl.formatMessage({id: translationItem.label});
  }
}

IsbnPublisherArchiveEntryModal.propTypes = {
  authenticationToken: PropTypes.string.isRequired,
  publisherId: PropTypes.number.isRequired
};

export default IsbnPublisherArchiveEntryModal;
