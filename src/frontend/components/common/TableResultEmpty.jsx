import React from 'react';
import {FormattedMessage} from 'react-intl';

function TableResultEmpty() {
  return (
    <p>
      <FormattedMessage id="common.noData" />
    </p>
  );
}

export default TableResultEmpty;
