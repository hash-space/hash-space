import * as React from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ShareContainer from './ShareContainer';

export default function ShareDialog() {
  const router = useRouter();
  const { query, pathname } = router;
  const modal =
    (Array.isArray(query.modal) ? query.modal[0] : query.modal) || '';

  const isOpen = modal === 'share';

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
        <DialogTitle id="alert-dialog-title">Share</DialogTitle>
        <DialogContent>
          <ShareContainer defaultText="" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
