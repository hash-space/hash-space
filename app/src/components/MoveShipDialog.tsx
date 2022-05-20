import * as React from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useStateContext } from '../context/state';

export default function MoveShipDialog() {
  const router = useRouter();
  const { query, pathname } = router;
  const modal = Array.isArray(query.modal) ? query.modal[0] : query.modal;

  const { playerContract } = useStateContext();

  const isOpen = modal === 'move';

  const handleClose = React.useCallback(() => {
    router.replace(pathname);
  }, [pathname]);

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Move ship</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to move your ship?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
          {playerContract.connected && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                playerContract.playerMoveShip(1, 1, 1, 1, 1);
                handleClose();
              }}
              autoFocus>
              Agree
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
