import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';
import history from '../history';
import PrimaryButtonComponent from './PrimaryButtonComponent';

const useMaterialDialogStyles = makeStyles(() => ({
  paper: {
    backgroundColor: '#FEDBD0',
    padding: '10px 10px',
    zIndex: 100,
  },
}));

const DialogComponent = ({ dialogTitle, dialogText, closeBtnText, backButtonText, dialogOpen, onCloseCallBack }) => {
  const materialDialogStyles = useMaterialDialogStyles();
  return (
    <Dialog
      open={dialogOpen}
      onClose={onCloseCallBack}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="sm"
      classes={{ paper: materialDialogStyles.paper }}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {closeBtnText &&
          <PrimaryButtonComponent onClick={onCloseCallBack} buttonText={closeBtnText} />
        }

        {backButtonText && 
          <PrimaryButtonComponent onClick={() => history.goBack()} buttonText={backButtonText} />
        }
      </DialogActions>
    </Dialog>
  );
}

export default DialogComponent;
