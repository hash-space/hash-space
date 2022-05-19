import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useQueryParams,
  StringParam,
  NumberParam,
  ArrayParam,
  withDefault,
} from 'use-query-params';
import { useStateContext } from '../context/state';

export default function SyncStepDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [query, setQuery] = useQueryParams({
    steps: NumberParam,
    error: StringParam,
  });

  React.useEffect(() => {
    if (query.steps > 0 || query.error) {
      setOpen(true);
    }
  }, [query.steps, query.error]);

  const { playerContract } = useStateContext();
  const isError = !!query.error;

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Sync Steps</DialogTitle>
        <DialogContent>
          {!isError && (
            <div>
              <DialogContentText id="alert-dialog-description">
                Do you want to sync your steps ({query.steps}) to the blockchain
              </DialogContentText>
              {!playerContract.connected && <CircularProgress />}
            </div>
          )}
          {isError && (
            <div>
              <DialogContentText id="alert-dialog-description">
                {mapError(query.error)}
              </DialogContentText>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {playerContract.connected && !isError && (
            <Button
              onClick={() => {
                playerContract.playerSyncSteps(query.steps);
                handleClose();
                setQuery({ error: '', steps: 0 });
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
