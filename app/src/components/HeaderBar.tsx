import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Avatar,
  Box,
} from '@mui/material';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthContext } from '../context/auth';
import { usePlayerContract } from '../context/state';
import Link from 'next/link';

export default function HeadBar() {
  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();
  const playerContract = usePlayerContract();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}>
          <Link href="/">
            <img src="/logo.png" title="hash space" height={35} />
          </Link>
          <Box sx={{ width: 8 }}></Box>
          <Link href="/">
            <span>Hash Space</span>
          </Link>
        </Typography>

        {ethersAppContext.active && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              avatar={
                <Avatar style={{ width: '50px', borderRadius: '16px' }}>
                  {playerContract.playerState.stepsAvailable}
                </Avatar>
              }
              label="Steps"
              variant="filled"
              color="secondary"
            />
            <Box sx={{ width: 8 }}></Box>
            <Button
              color="secondary"
              variant="outlined"
              onClick={authContext.logout}>
              Logout
            </Button>
          </Box>
        )}
        {!ethersAppContext.active && (
          <div>
            <Button
              color="secondary"
              variant="outlined"
              onClick={authContext.login}>
              Connect Wallet
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
