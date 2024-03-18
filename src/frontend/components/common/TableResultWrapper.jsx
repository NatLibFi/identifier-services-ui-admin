import React from 'react';
import PropTypes from 'prop-types';

import Spinner from '/src/frontend/components/common/Spinner.jsx';

import TableResultError from '/src/frontend/components/common/TableResultError.jsx';
import TableResultEmpty from '/src/frontend/components/common/TableResultEmpty.jsx';

function TableResultWrapper({error, loading, hasData, children}) {
  if (error) {
    return <><TableResultError /></>;
  }

  if (loading) {
    return <><Spinner /></>;
  }

  if (!hasData) {
    return <><TableResultEmpty /></>;
  }

  return (
    <>
      {children}
    </>
  );

}

TableResultWrapper.propTypes = {
  error: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  hasData: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

export default TableResultWrapper;
