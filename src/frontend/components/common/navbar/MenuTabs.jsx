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
import {PropTypes} from 'prop-types';
import {NavLink} from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';

import {Menu, MenuItem, Link} from '@mui/material';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';

import '/src/frontend/css/navigationBar/menuTabs.css';

function MenuTabs(props) {
  const {navbarItem, isAuthenticated} = props;
  const [anchorEl, setAnchorEl] = useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <div onClick={handleClick}>
        {navbarItem.path !== undefined ? (
          <NavLink exact to={`/${navbarItem.path}`}>
            <div className={isAuthenticated ? 'menuItemLoggedIn' : 'menuItem'}>
              {navbarItem.label}
            </div>
          </NavLink>
        ) : (
          <Link component="button">
            <div className={isAuthenticated ? 'menuItemLoggedIn' : 'menuItem'}>
              {navbarItem.label}
              <ArrowDropDown />
            </div>
          </Link>
        )}
      </div>
      {navbarItem.listItem && (
        <Menu
          keepMounted
          elevation={0}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          transformOrigin={{vertical: 'top', horizontal: 'center'}}
          id="customized-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {navbarItem.listItem.map((item) => (
            <div key={uuidv4()}>
              <NavLink exact to={`/${item.path}`}>
                <MenuItem
                  onClick={handleClose}
                  key={item.label}
                  className="menuContainer"
                >
                  {item.label}
                </MenuItem>
              </NavLink>
            </div>
          ))}
        </Menu>
      )}
    </>
  );
}

MenuTabs.propTypes = {
  navbarItem: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired
};

export default MenuTabs;
