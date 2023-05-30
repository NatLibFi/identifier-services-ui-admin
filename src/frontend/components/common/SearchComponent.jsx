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
import {withRouter} from 'react-router-dom';
import {useIntl} from 'react-intl';
import PropTypes from 'prop-types';

import {TextField, InputAdornment, IconButton} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import '/src/frontend/css/searchComponent.css';

function SearchComponent({searchFunction, initialValue}) {
  const intl = useIntl();

  const [inputVal, setInputVal] = useState(initialValue ?? '');

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchFunction(inputVal);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        id="search-input"
        placeholder={intl.formatMessage({id: 'common.search.inputPlaceholder'})}
        margin="normal"
        variant="outlined"
        value={inputVal}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleSubmit}
                aria-label="button for searching publisher by name or identifier"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        className="searchBox"
        onChange={handleInputChange}
      />
    </form>
  );
}

SearchComponent.propTypes = {
  searchFunction: PropTypes.func.isRequired,
  initialValue: PropTypes.string
};

export default withRouter(SearchComponent);
