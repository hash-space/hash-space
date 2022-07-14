import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Box,
  Switch
} from '@mui/material';
import { useEthersAppContext } from 'eth-hooks/context';
import { useAuthContext } from '../context/auth';
import { useStateContext } from '../context/state';
import Link from 'next/link';

export default function HeadBar() {
  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();
  const { playerContract } = useStateContext();

  return (
    <AppBar position="static">
      {authContext.isLoading && <LinearProgress />}
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
              label={`${playerContract.playerState.amountEarned} earned`}
              variant="outlined"
              color="primary"
            />
            <Box sx={{ width: 8 }}></Box>
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
              onClick={() => authContext.login()}>
              Connect Wallet
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
