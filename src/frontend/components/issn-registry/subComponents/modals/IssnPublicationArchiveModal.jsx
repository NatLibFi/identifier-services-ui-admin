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

function IssnPublicationArchiveModal({userInfo, publicationId}) {
  const {authenticationToken} = userInfo;

  const [isModalOpen, setIsModalOpen] = useState(false); // State of the modal window (open/closed)

  const {data, loading, error} = useItem({
    url: `/api/issn-registry/publications/${publicationId}/get-archive-entry`,
    method: 'GET',
    authenticationToken,
    dependencies: [publicationId, isModalOpen, authenticationToken],
    prefetch: false,
    fetchOnce: true,
    requireAuth: true
  });

  const component = getComponent();

  function getComponent() {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <Typography>
          <FormattedMessage id="error.issn.archive" />
        </Typography>
      );
    }

    return (
      <>
        <Typography variant="h5">
          <FormattedMessage id="modal.issn.archive.record" />
        </Typography>
        <div className="archiveRecordContainer">
          <div>
            <Typography>
              <FormattedMessage id="form.common.title" />:
            </Typography>{' '}
            <p>{data.title}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.subtitle" />:
            </Typography>{' '}
            <p>{data.subtitle ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.publicationCity" />:
            </Typography>{' '}
            <p>{data.placeOfPublication}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.issn.publicationInfo.printer" />:
            </Typography>{' '}
            <p>{data.printer ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publication.issn.firstYear" />:
            </Typography>{' '}
            <p>{data.issuedFromYear ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publication.issn.issued_from_number" />:
            </Typography>{' '}
            <p>{data.issuedFromNumber ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="form.common.language" />:
            </Typography>{' '}
            <p>
              <FormattedMessage id={`common.${data.language?.toLowerCase()}`} />
            </p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publication.issn.frequency" />:
            </Typography>{' '}
            <p>
              {data.frequency ? (
                <FormattedMessage id={`common.${data.frequency}`} />
              ) : (
                '-'
              )}
            </p>
          </div>
          {data.frequency === 'z' && ( // If frequency is set to 'other' (z)
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.other" />:
              </Typography>{' '}
              <p>{data.frequencyOther ?? '-'}</p>
            </div>
          )}
          <div>
            <Typography>
              <FormattedMessage id="publication.issn.type" />:
            </Typography>{' '}
            <p>
              <FormattedMessage id={`common.${data.publicationType?.toLowerCase()}`} />
            </p>
          </div>
          {data.publicationType === 'OTHER_SERIAL' && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.other" />:
              </Typography>{' '}
              <p>{data.publicationTypeOther ?? '-'}</p>
            </div>
          )}
          <div>
            <Typography>
              <FormattedMessage id="form.common.format" />:
            </Typography>{' '}
            <p>
              <FormattedMessage id={`common.${data.medium?.toLowerCase()}`} />
            </p>
          </div>
          {data.medium === 'OTHER' && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.other" />:
              </Typography>{' '}
              <p>{data.mediumOther ?? '-'}</p>
            </div>
          )}
          <div>
            <Typography>
              <FormattedMessage id="form.common.url" />:
            </Typography>{' '}
            <p>{data.url ?? '-'}</p>
          </div>
          {data.previous?.title[0] && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.previousNameForms" />:
              </Typography>{' '}
              <p>{data.previous.title.join(', ')}</p>
            </div>
          )}
          {data.previous?.issn[0] && (
            <div>
              <Typography>
                <FormattedMessage id="common.issn" />:
              </Typography>{' '}
              <p>{data.previous.issn.join(', ')}</p>
            </div>
          )}
          {data.previous?.lastIssue[0] && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.lastIssue" />:
              </Typography>{' '}
              <p>{data.previous.lastIssue.join(', ')}</p>
            </div>
          )}
          {data.mainSeries?.title[0] && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.mainSeries" />:
              </Typography>{' '}
              <p>{data.mainSeries.title.join(', ')}</p>
            </div>
          )}
          {data.mainSeries?.issn[0] && (
            <div>
              <Typography>
                <FormattedMessage id="common.issn" />:
              </Typography>{' '}
              <p>{data.mainSeries.issn.join(', ')}</p>
            </div>
          )}
          {data.subseries?.title[0] && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.subSeries" />:
              </Typography>{' '}
              <p>{data.subseries.title.join(', ')}</p>
            </div>
          )}
          {data.subseries?.issn[0] && (
            <div>
              <Typography>
                <FormattedMessage id="common.issn" />:
              </Typography>{' '}
              <p>{data.subseries.issn.join(', ')}</p>
            </div>
          )}
          {data.anotherMedium?.title[0] && (
            <div>
              <Typography>
                <FormattedMessage id="publication.issn.anotherFormat" />:
              </Typography>{' '}
              <p>{data.anotherMedium.title.join(', ')}</p>
            </div>
          )}
          {data.anotherMedium?.issn[0] && (
            <div>
              <Typography>
                <FormattedMessage id="common.issn" />:
              </Typography>{' '}
              <p>{data.anotherMedium.issn.join(', ')}</p>
            </div>
          )}
          <div>
            <Typography>
              <FormattedMessage id="form.common.additionalDetails" />:
            </Typography>{' '}
            <p>{data.additionalInfo ?? '-'}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="publisher.issn.formId" />:
            </Typography>{' '}
            <p>{data.formId}</p>
          </div>
          <div>
            <Typography>
              <FormattedMessage id="modal.issn.archive.publication.id" />:
            </Typography>{' '}
            <p>{data.publicationId}</p>
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
        variant="contained"
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

IssnPublicationArchiveModal.propTypes = {
  publicationId: PropTypes.number.isRequired,
  userInfo: PropTypes.object.isRequired
};

export default IssnPublicationArchiveModal;
