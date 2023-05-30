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

import {Modal, Typography, Button, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import '/src/frontend/css/modalLayout.css';

function ModalLayout(props) {
  // TODO: refactor this component away alltogether
  const {
    label,
    name,
    children,
    variant,
    color,
    mainClass,
    classed,
    isTableRow,
    title,
    setModal
  } = props;

  const [openModal, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  function handleClose() {
    setOpen(false);

    if (isTableRow) {
      setModal(false);
    }
  }

  return (
    <>
      <Button
        disableRipple
        variant={variant}
        color={color}
        className={classed}
        size="medium"
        onClick={handleOpen}
      >
        <span>{label}</span>
      </Button>
      <Modal
        disableRestoreFocus
        open={openModal}
        className="modalLayoutContainer"
        aria-labelledby={`modal-${name}`}
        aria-describedby="modal-description"
        onClose={handleClose}
      >
        <div className={mainClass ? mainClass : 'main'}>
          <IconButton aria-label="Close" className="closeButton" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          {title && (
            <Typography variant="h5" id={`modal-${name}`} className="modalTitle">
              {title}
            </Typography>
          )}
          {React.cloneElement(children, {handleClose})}
        </div>
      </Modal>
    </>
  );
}

ModalLayout.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  name: PropTypes.string,
  children: PropTypes.node,
  variant: PropTypes.string,
  color: PropTypes.string,
  mainClass: PropTypes.string,
  classed: PropTypes.string,
  isTableRow: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  setModal: PropTypes.func
};

export default ModalLayout;
