import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ShareContainer from './ShareContainer';
import { useConquerEvent } from '../context/state';
import * as ethers from 'ethers';

export default function ConquerDialog() {
  const conquer = useConquerEvent();
  const isSuccess = conquer.isSet && !conquer.amount.isZero();
  return (
    <div>
      <Dialog
        open={conquer.isSet}
        onClose={() => conquer.reset()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          You conquered a planet
        </DialogTitle>
        <DialogContent>
          {!isSuccess && (
            <div>
              but you didn&apos;t earn any yield, better luck next time.
            </div>
          )}
          {isSuccess && (
            <div>
              <Typography variant="body1" gutterBottom>
                You earned {ethers.utils.formatEther(conquer.amount)} MATIC.{' '}
                <br />
                Share it on:
              </Typography>
              <ShareContainer
                defaultText={`i just earned ${ethers.utils.formatEther(
                  conquer.amount
                )} MATIC by conquering a planet on hashspace.quest`}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => conquer.reset()} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
