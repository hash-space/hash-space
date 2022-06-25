import * as React from 'react';
import {
  Button,
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import { useStateContext } from '../context/state';
import { useAuthContext } from '../context/auth';
import { useEthersAppContext } from 'eth-hooks/context';

export function PlayInstructionSimple() {
  const [expanded, setExpanded] = React.useState(false);
  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();
  const { playerContract } = useStateContext();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const walletConnected = ethersAppContext.active;
  const registered =
    ethersAppContext.active && playerContract.playerState.isSignedUp;

  return (
    <>
      <Accordion
        elevation={10}
        expanded={expanded == 'panel1'}
        onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography sx={{ width: '10%', flexShrink: 0 }}>1</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Connect Wallet
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            Connect your wallet so hash-space can communicate with the
            corresponding blockchain via your wallets rpc provider.
          </Typography>
          <Button
            disabled={walletConnected}
            color="secondary"
            variant="outlined"
            startIcon={walletConnected ? <DoneIcon /> : null}
            onClick={() => authContext.login()}
            size="small">
            Connect Wallet
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={10}
        expanded={expanded == 'panel4'}
        onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header">
          <Typography sx={{ width: '10%', flexShrink: 0 }}>2</Typography>
          <Typography sx={{ color: 'text.secondary' }}>View Game</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Link
            href={{
              pathname: '/game',
            }}>
            <Button
              disabled={!walletConnected}
              size="small"
              color="secondary"
              variant="outlined">
              Go to game
            </Button>
          </Link>
          {!walletConnected && (
            <Alert sx={{ marginTop: 1 }} severity="error">
              Connect your wallet first
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export function PlayInstruction() {
  const [expanded, setExpanded] = React.useState(false);
  const ethersAppContext = useEthersAppContext();
  const authContext = useAuthContext();
  const { playerContract } = useStateContext();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const walletConnected = ethersAppContext.active;
  const registered =
    ethersAppContext.active && playerContract.playerState.isSignedUp;

  return (
    <>
      <Accordion
        elevation={10}
        expanded={expanded == 'panel1'}
        onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header">
          <Typography sx={{ width: '10%', flexShrink: 0 }}>1</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Connect Wallet
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            Connect your wallet so hash-space can communicate with the
            corresponding blockchain via your wallets rpc provider.
          </Typography>
          <Button
            disabled={walletConnected}
            color="secondary"
            variant="outlined"
            startIcon={walletConnected ? <DoneIcon /> : null}
            onClick={() => authContext.login()}
            size="small">
            Connect Wallet
          </Button>
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={10}
        expanded={expanded == 'panel2'}
        onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header">
          <Typography sx={{ width: '10%', flexShrink: 0 }}>2</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Register / Mint Starship
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            To play the game you will need a starship NFT. On registration you
            will get the NFT minted to your wallet. We charge a fee of 0.01
            MATIC for the NFT to fill our treasury. The treasuries balance gets
            invested in yield farming proviers. You can the farm that yield from
            planets in Step 5.
          </Typography>
          <Button
            disabled={registered || !walletConnected}
            startIcon={registered ? <DoneIcon /> : null}
            color="secondary"
            variant="outlined"
            onClick={playerContract.playerRegister}
            size="small">
            Register
          </Button>
          {!walletConnected && (
            <Alert sx={{ marginTop: 1 }} severity="error">
              Connect your wallet first
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={10}
        expanded={expanded == 'panel3'}
        onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header">
          <Typography sx={{ width: '10%', flexShrink: 0 }}>3</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Sync your foot-steps of your smart-device
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Your NFT starship can only travel with the power of your foot-steps.
            To fuel your starship we need to pull your foot-steps for your
            smart-device and sync them to the blockchain. The more you walk the
            more distant planets you can reach.
          </Typography>
          <ol>
            <li>
              Download the google fit app{' '}
              <Link href="http://onelink.to/yrjrzp">
                <Button size="small" variant="outlined" color="secondary">
                  here
                </Button>
              </Link>
            </li>
            <li>Grant permissions to pull your step data</li>
            <li>
              Sync your steps into the game{' '}
              <Button
                disabled={!registered}
                color="secondary"
                variant="outlined"
                size="small">
                Sync steps
              </Button>
            </li>
          </ol>
          {!registered && (
            <Alert sx={{ marginTop: 1 }} severity="error">
              Connect your wallet & register first
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
      <Accordion
        elevation={10}
        expanded={expanded == 'panel4'}
        onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header">
          <Typography sx={{ width: '10%', flexShrink: 0 }}>4</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Move your starship to a planet to earn yield
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography gutterBottom>
            Click on a planet to conquer a planet with your starship. The
            different colors of planets indicate the different providers of
            yield farming startegies. Every planet you conquer can potentially
            yield you the farming yield of a provider.
          </Typography>
          <Link
            href={{
              pathname: '/game',
            }}>
            <Button
              disabled={!walletConnected}
              size="small"
              color="secondary"
              variant="outlined">
              Go to game
            </Button>
          </Link>
          {!walletConnected && (
            <Alert sx={{ marginTop: 1 }} severity="error">
              Connect your wallet first
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
}
