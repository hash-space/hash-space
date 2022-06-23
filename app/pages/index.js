import dynamic from 'next/dynamic';
import { useEthersAppContext } from 'eth-hooks/context';
import { useStateContext } from '../src/context/state';
import { PageWrapper } from '../src/components/PageWrapper';
import { Typography, Button, ButtonGroup, Alert } from '@mui/material';
import SyncStepDialog from '../src/components/SyncStepDialog';
import ShareDialog from '../src/components/ShareDialog';
import { useRouter } from 'next/router';
import { getAddress } from '../src/helper/getAddress';

import Link from 'next/link';
const EpnsButtonNoSSR = dynamic(() => import('../src/components/EpnsButton'), {
  ssr: false,
});
import { Container, Paper, Box } from '@mui/material';
import { getCallbackUrl } from '../src/helper/callbackUrl';
import { StepLeaderBoard } from '../src/components/StepLeaderboard';
import { YieldLeaderBoard } from '../src/components/YieldLeaderboard';


export default function Home() {
  const ethersAppContext = useEthersAppContext();
  const router = useRouter();
  const isDebug = !!router.query.debug;
  const secret = router.query.debug; // enable for debugging

  const { playerContract, shipsContract, worldContract } = useStateContext();
  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <SyncStepDialog />
          <ShareDialog />
          <Typography variant="h5" gutterBottom component="div">
            <b>HASH SPACE: The DeFi Explorer</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            <b>
              <em>
                Learn about DeFi and earn yield while exploring different
                worlds.
              </em>
            </b>
            <br />
            <br />
          </Typography>
          <Typography variant="h6" gutterBottom>
            How to play
          </Typography>
          <Typography variant="body1" gutterBottom>
            Visit different planets to pick up the yield they&apos;ve generated
            since the last visitor. The fuel for your ship comes from your
            real-world steps. At each planet, you&apos;ll learn about the
            protocol used to generate that yield. Explore as many planets as you
            can. You&apos;ll learn about Yearn Finance, MakerDAO, UniSwap, Aave
            and more!
          </Typography>
          {isDebug && (
            <div>
              <hr></hr>
              <h1>user</h1>
              <div>{JSON.stringify(playerContract.playerState)}</div>
              <button
                onClick={() => {
                  location = `${location.protocol}//${location.host}/api/sign?steps=50000&lastTimeSync=${playerContract.playerState?.lastQueried}&secret=${secret}`;
                }}>
                get 50000 steps
              </button>
              <h1>ships</h1>
              <ul>
                {shipsContract.ships.map((ship) => (
                  <li key={ship.id}>
                    <div>{JSON.stringify(ship)}</div>
                    <Link
                      href={{
                        pathname: '/',
                        query: { modal: 'move' },
                      }}>
                      <button>move ship {ship.id}</button>
                    </Link>
                  </li>
                ))}
              </ul>
              <hr></hr>
              <h1>planets</h1>
              <ul>
                {worldContract.planets.map((planet) => (
                  <li key={planet.id}>
                    <div>
                      id: {planet.id}, mapId: {planet.worldMapIndex}, x:{' '}
                      {planet.x}, y: {planet.y}, type; {planet.planetType}
                    </div>
                  </li>
                ))}
              </ul>
              <hr></hr>
              <Link
                href={{
                  pathname: '/',
                  query: { steps: 5000 },
                }}>
                <button>get 5000 steps</button>
              </Link>
              <p>account: {ethersAppContext.account}</p>
              <p>chain: {ethersAppContext.chainId}</p>
              <p>active: {ethersAppContext.active ? 'yes' : 'no'}</p>
            </div>
          )}
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            <b>PLAY</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Explore different DeFi galaxies by connecting to different chains:
          </Typography>
          <ol>
            <li>
              <b>The Polygon Planetary System</b> (on Polygon Mumbai)
            </li>
            <li>
              <b>The Oasis Constellation</b> (on Oasis Emerald Testnet)
            </li>
            <li>
              <b>The Arbitrum Nitro Nebula</b> (on Arbitrum Nitro Devnet)
            </li>
          </ol>
          <Typography variant="body1" gutterBottom>
            <em>
              Note: requires 0.01 MATIC / ROSE / ETH to register (in order to
              mint the starship NFT).
            </em>
          </Typography>
          <div>
            {!playerContract.playerState.isSignedUp && ethersAppContext.active && (
              <Button
                color="secondary"
                variant="outlined"
                onClick={playerContract.playerRegister}>
                Register
              </Button>
            )}
            {playerContract.playerState.isSignedUp && (
              <>
                <ButtonGroup size="large" aria-label="large button group">
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={() => {
                      const url = new URL('/api/auth', getCallbackUrl());
                      url.searchParams.set(
                        'lastSync',
                        playerContract.playerState.lastQueried
                      );
                      url.searchParams.set('redirectUrl', location.href);
                      location.href = url.href;
                    }}>
                    Sync your steps
                  </Button>
                  <Link
                    href={{
                      pathname: '/game',
                    }}>
                    <Button color="secondary" variant="outlined">
                      Go to game
                    </Button>
                  </Link>
                </ButtonGroup>
                <Typography variant="body1" gutterBottom>
                  <br />
                  In order to sync your steps:
                </Typography>
                <ol>
                  <li>
                    Download the google fit app{' '}
                    <a href="http://onelink.to/yrjrzp">here (link)</a>
                  </li>
                  <li>Grant permissions to pull your step data</li>
                  <li>Sync your steps into the game</li>
                </ol>
              </>
            )}
          </div>
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            <b>NFT Collection / OpenSea</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            You&apos;ll receive a starship NFT on registration. View the full
            collection and trade starships on the following networks:
          </Typography>
          <div>
            <ButtonGroup size="large" aria-label="large button group">
              <a
                rel="noreferrer"
                target={'_blank'}
                href={`https://testnets.opensea.io/assets?search[query]=${getAddress(
                  80001,
                  'Starship'
                )}`}>
                <Button color="secondary" variant="outlined">
                  Mumbai
                </Button>
              </a>
            </ButtonGroup>
          </div>
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            <b>Share</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Show some love and share us on different social channels
          </Typography>
          <div>
            <Link
              href={{
                pathname: '/',  
                query: { modal: 'share' },
              }}>
              <Button color="secondary" variant="outlined">
                Share
              </Button>
            </Link>
          </div>
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            <b>Leaderboard</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            The most steps were taken this week by:
          </Typography>
          <StepLeaderBoard />
          <Typography variant="body1" gutterBottom>
            The most yield (all-time) was earned by:
          </Typography>
          <YieldLeaderBoard />
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            <b>Support us</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Support future game development by donating to our
            <a href="https://gitcoin.co/grants/6326/hash-space-the-defi-explorer-a-game-to-educate-an">
              {' '}
              Gitcoin Grant
            </a>
            . All donations are matched by a pool of <b>over $3.5 million</b> -
            meaning a $1 donation could lead to us receiving more than $50.
          </Typography>
          <div>
            <Link
              href={
                'https://gitcoin.co/grants/6326/hash-space-the-defi-explorer-a-game-to-educate-an'
              }>
              <Button color="secondary" variant="outlined">
                Support us
              </Button>
            </Link>
          </div>
        </Paper>
        <Box sx={{ height: 10 }} />
        <Paper style={{ padding: '10px' }}>
          <Typography variant="h5" gutterBottom component="div">
            <b>Subscribe to our EPNS Channel</b>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Keep up-to-date with the latest events across your chosen universes.
          </Typography>
          <Alert severity="warning">only available on testnet kovan</Alert>
          <Box sx={{ height: 10 }} />
          <div>
            <EpnsButtonNoSSR />
          </div>
        </Paper>
      </Container>
    </PageWrapper>
  );
}
