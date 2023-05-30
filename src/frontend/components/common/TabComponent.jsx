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

import React from 'react';
import {FormattedMessage} from 'react-intl';
import {PropTypes} from 'prop-types';

import {Tabs, Tab} from '@mui/material';

import '/src/frontend/css/tabComponent.css';

function TabComponent({handleChange, sortStateBy, typeOfService, issnPublications}) {
  return getTabs();

  function getTabs() {
    if (issnPublications) {
      return (
        // Used for ISSN publications
        <Tabs
          className="tabs"
          value={sortStateBy}
          indicatorColor="primary"
          textColor="primary"
          variant="standard"
          onChange={handleChange}
        >
          <Tab
            value="NO_PREPUBLICATION_RECORD"
            label={<FormattedMessage id="common.no_prepublication_record" />}
          />
          <Tab value="ISSN_FROZEN" label={<FormattedMessage id="common.issn_frozen" />} />
          <Tab
            value="WAITING_FOR_CONTROL_COPY"
            label={<FormattedMessage id="common.waiting_for_control_copy" />}
          />
          <Tab value="COMPLETED" label={<FormattedMessage id="common.completed" />} />
          <Tab
            value="NO_ISSN_GRANTED"
            label={<FormattedMessage id="common.no_issn_granted" />}
          />
          <Tab value="all" label={<FormattedMessage id="tab.filter.showall" />} />
        </Tabs>
      );
    }

    return (
    // Used for all other cases (ISSN requests, ISBN/ISMN requests)
      <Tabs
        className="tabs"
        value={sortStateBy}
        indicatorColor="primary"
        textColor="primary"
        variant="standard"
        onChange={handleChange}
      >
        <Tab
          value={typeOfService === 'issn' ? 'NOT_HANDLED' : 'NEW'}
          label={
            typeOfService === 'issn' ? (
              <FormattedMessage id="tab.filter.not_handled.issn" />
            ) : (
              <FormattedMessage id="tab.filter.new" />
            )
          }
        />
        <Tab
          value={typeOfService === 'issn' ? 'NOT_NOTIFIED' : 'IN_PROCESS'}
          label={
            typeOfService === 'issn' ? (
              <FormattedMessage id="tab.filter.not_notified.issn" />
            ) : (
              <FormattedMessage id="tab.filter.inProgress" />
            )
          }
        />
        <Tab
          value={typeOfService === 'issn' ? 'COMPLETED' : 'ACCEPTED'}
          label={
            typeOfService === 'issn' ? (
              <FormattedMessage id="tab.filter.accepted.issn" />
            ) : (
              <FormattedMessage id="tab.filter.accepted" />
            )
          }
        />
        <Tab value="REJECTED" label={<FormattedMessage id="tab.filter.rejected" />} />
        <Tab value="all" label={<FormattedMessage id="tab.filter.showall" />} />
      </Tabs>
    );
  }
}

TabComponent.propTypes = {
  handleChange: PropTypes.func.isRequired,
  sortStateBy: PropTypes.string.isRequired,
  typeOfService: PropTypes.string,
  issnPublications: PropTypes.bool
};

export default TabComponent;
