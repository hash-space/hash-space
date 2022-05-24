import * as React from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import { useStateContext } from '../context/state';

export default function SyncStepDialog() {
  const router = useRouter();
  const { query, pathname } = router;
  const steps = parseInt(
    Array.isArray(query.steps) ? query.steps[0] : query.steps
  );
  const error = Array.isArray(query.error) ? query.error[0] : query.error;

  const isOpen = Boolean(steps > 0 || query.error);

  const { playerContract } = useStateContext();
  const isError = !!error;

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
        <DialogTitle id="alert-dialog-title">Sync Steps</DialogTitle>
        <DialogContent>
          {!isError && (
            <div>
              <DialogContentText id="alert-dialog-description">
                Do you want to sync your steps ({steps}) to the blockchain
              </DialogContentText>
              {!playerContract.connected && (
                <div
                  style={{
                    paddingTop: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CircularProgress />
                </div>
              )}
            </div>
          )}
          {isError && (
            <div>
              <DialogContentText id="alert-dialog-description">
                {mapError(error)}
              </DialogContentText>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
          {playerContract.connected && !isError && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                playerContract.playerSyncSteps(steps);
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

function mapError(errorMsg) {
  switch (errorMsg) {
    case 'error2':
      return 'maybe you need to sync your steps first or you are synced up already';
    case 'error1':
      return 'could not get data';
    default:
      return 'undefined error';
  }
}
