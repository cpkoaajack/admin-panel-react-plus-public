import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

import { Link } from 'react-router-dom';

const PaperComponent = (props) => {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const ErrorMessage = ({ open, message, handleClose }) => {
  return (
    <div className='error-message'>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby='draggable-dialog-title'
      >
        <DialogTitle style={{ cursor: 'move' }} id='draggable-dialog-title'>
          Error!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link
            style={{
              textDecoration: 'none',
            }}
            to='/dashboard'
          >
            <Button onClick={handleClose} color='primary'>
              Ok
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorMessage;
