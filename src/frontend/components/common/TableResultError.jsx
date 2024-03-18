import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Typography} from '@mui/material';

function TableResultError() {
  return (
    <Typography variant="h2" className="normalTitle">
      <FormattedMessage id="errorPage.message.defaultError" />
    </Typography>
  );
}

export default TableResultError;
