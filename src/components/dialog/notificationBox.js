import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function NotificationBox(props) {
    const [open, setOpen] = React.useState(props.isNotify);

    const handleClose = () => {
      setOpen(false);
      props.closeCallback(true);
    };
  
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
          {"Уведомление!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} color="primary" autoFocus>
                Закрыть
              </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }