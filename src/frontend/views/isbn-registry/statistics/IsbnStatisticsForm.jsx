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
import {Form} from 'react-final-form';
import moment from 'moment';

import {downloadFile} from '/src/frontend/actions';

import {Button, Typography, Box, CircularProgress} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import '/src/frontend/css/forms/statisticsGeneratingForm.css';

import RenderElement from '/src/frontend/components/common/form/RenderElement.jsx';
import {validate} from '/src/frontend/components/isbn-registry/statisticsGeneratingForm/validation';
import {STATISTIC_FORM_FIELDS} from '/src/frontend/components/isbn-registry/statisticsGeneratingForm/content';

function IsbnStatisticsForm(props) {
  const {authenticationToken} = props;

  const intl = useIntl();
  const [loading, setLoading] = useState(false);

  // Handler for generating statistics
  const handleGeneratingStatistics = async values => {
    setLoading(true);
    const statisticsValues = {
      begin: moment(values.statisticsBeginDate).format('YYYY-MM-DD'),
      end: moment(values.statisticsEndDate).format('YYYY-MM-DD'),
      type: values.statisticsType,
      format: values.statisticsFileFormat
    };

    await downloadFile({
      url: '/api/isbn-registry/statistics',
      method: 'POST',
      requestBody: statisticsValues,
      authenticationToken
    });

    setLoading(false);
  };

  // Required to avoid focus issues on edit
  const dataComponent = <RenderElement array={STATISTIC_FORM_FIELDS} intl={intl} />;

  return (
    <Box>
      <Form
        onSubmit={handleGeneratingStatistics}
        validate={validate}
      >
        {({handleSubmit, valid, values}) => (
          <form className='statisticsForm' onSubmit={handleSubmit} >
            <Typography variant="h5">
              <FormattedMessage id="common.statistics"/>
            </Typography>

            <div className='statisticsFieldsContainer'>
              {dataComponent}
            </div>

            {/* Show an error message when statisticsBeginDate is set to be after the statisticsEndDate */}
            {moment(values.statisticsBeginDate).isAfter(values.statisticsEndDate) && (
              <Typography className='statisticsDateInvalidMessage'>
                <ErrorIcon/><FormattedMessage id="error.statistics.date.invalid"/>
              </Typography>
            )}

            <Button
              type="submit"
              disabled={!valid}
              variant="contained"
              color="success"
            >
              <FormattedMessage id="statistics.get"/>
            </Button>

            {/* Show loading message & spinner when statistics is being generated */}
            {loading &&
                <div className='statisticsSpinner'>
                  <Typography>
                    <FormattedMessage id='statistics.generating'/>
                  </Typography>
                  <CircularProgress/>
                </div>
            }
          </form>
        )}
      </Form>
    </Box>
  );
}

IsbnStatisticsForm.propTypes = {
  authenticationToken: PropTypes.string
};

export default IsbnStatisticsForm;
