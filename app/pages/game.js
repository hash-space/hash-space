import { PageWrapper } from '../src/components/PageWrapper';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Paper } from '@mui/material';
import { useWindowSize } from '../src/hooks/useWindowSize';
import GameComponent from '../src/components/GameComponent';
import { useStateContext } from '../src/context/state';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { calcDistance, distanceToSteps } from '../src/helper/distance';
import EventEmitter from 'events';

export default function Game() {
  const size = useWindowSize();
  const eventStream = useRef(new EventEmitter());
  const { worldContract, shipsContract, playerContract } = useStateContext();
  const [isOpen, setOpen] = useState(false);
  const [payload, setPayload] = useState(undefined);

  useEffect(() => {
    function clickPlanet(payload) {
      setOpen(true);
      setPayload(payload);
    }
    function targetReached(payload) {
      playerContract.playerMoveShip(
        payload.planet.x,
        payload.planet.y,
        payload.planet.id,
        payload.ship.id,
        1
      );
    }
    eventStream.current.on('targetReached', targetReached);
    eventStream.current.on('clickPlanet', clickPlanet);
    return () => {
      eventStream.current.removeListener('targetReached', targetReached);
      eventStream.current.removeListener('clickPlanet', clickPlanet);
    };
  }, [playerContract]);

  const myShip = useMemo(() => {
    return shipsContract.ships.find((s) => s.isMine);
  }, [shipsContract.ships]);

  const confirmMove = useCallback(() => {
    setOpen(false);
    // tell the ship to move
    eventStream.current.emit('travelShip:' + myShip.id, payload.planet);
  }, [eventStream.current, myShip, payload]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setPayload(undefined);
  }, []);

  const distance = myShip && payload ? calcDistance(myShip, payload.planet) : 0;
  const stepsNeeded = distanceToSteps(distance);

  const leftRightPadding = size.width > 800 ? 50 : 0;
  const height = size.height - 110;

  const isLoaded =
    height > 0 &&
    worldContract.planets.length > 0 &&
    shipsContract.ships.length > 0;

  return (
    <PageWrapper>
      <div style={{ height: 20 }}></div>
      <MoveShipDialog
        isOpen={isOpen}
        distance={distance}
        stepsNeeded={stepsNeeded}
        confirmMove={confirmMove}
        handleClose={handleClose}
        stepsAvailable={playerContract.playerState.stepsAvailable}
        planet={payload?.planet}
      />
      <div
        style={{
          paddingLeft: leftRightPadding,
          paddingRight: leftRightPadding,
        }}>
        <Paper style={{ padding: '10px' }}>
          <div
            style={{
              display: 'block',
              position: 'relative',
            }}>
            <div style={{ paddingTop: height }}></div>
            {isLoaded && (
              <GameComponent
                ships={shipsContract.ships}
                planets={worldContract.planets}
                steps={playerContract.playerState.stepsAvailable}
                eventStream={eventStream.current}
              />
            )}
          </div>
        </Paper>
      </div>
    </PageWrapper>
  );
}

const message = {};
message['Blue'] = (
  <span>
    AAVE. The galaxy&apos;s biggest DeFi lending planet where users can
    participate as depositors or borrowers.
    <br />
    Depositors provide liquidity to the market to earn a passive income, while
    borrowers are able to borrow over and undercollateralized assets.
    <br />
    You can learn more about this planet{' '}
    <a href="https://aave.com/">
      <u>here</u>
    </a>
  </span>
);
message['Orange'] = (
  <span>
    Yearn. A yield farming planet where you can stake your cryptocurrency to
    earn interest as passive income.
    <br />
    You can learn more about this planet{' '}
    <a href="https://yearn.finance/">
      <u>here</u>
    </a>{' '}
  </span>
);
message['Green'] = (
  <span>
    MakerDAO. This planet is the galaxy&apos;s source of Dai, the leading
    unbiased decentralized stablecoin.
    <br />
    You can learn more about this planet{' '}
    <a href="https://makerdao.com/">
      <u>here</u>
    </a>
  </span>
);
message['Pink'] = (
  <span>
    Uniswap. This planet is the place to swap, earn, and build on the leading
    decentralized crypto trading protocol.
    <br />
    Here developers, traders, and liquidity providers participate together in a
    financial marketplace that is open and accessible to all.
    <br />
    You can learn more about this planet{' '}
    <a href="https://uniswap.org/">
      <u>here</u>
    </a>{' '}
  </span>
);
message['White'] = (
  <span>
    APWine. This planet is a leading yield derivatives marketplace.
    <br />
    Here you can tokenise and get your yield upfront, and hedge your risk on APY
    volatility.
    <br />
    You can learn more about this planet{' '}
    <a href="https://www.apwine.fi/">
      <u>here</u>
    </a>{' '}
  </span>
);

export function MoveShipDialog(props) {
  const stepsMissing = props.stepsNeeded > props.stepsAvailable;
  return (
    <div>
      <Dialog
        open={props.isOpen}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Move ship</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {stepsMissing && (
              <Alert severity="error">you are missing steps</Alert>
            )}
            <Box sx={{ height: 10 }}></Box>
            <div>
              This is planet {message[props.planet?.category]}.
              <br />
              <br />
              You need {props.stepsNeeded} steps to get there.
              <br />
              Are you sure you want to move your ship over that distance?
              {/* Distance: {props.distance} ,  */}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} variant="text">
            No, stay here
          </Button>
          <Button
            disabled={stepsMissing}
            onClick={props.confirmMove}
            color="secondary"
            variant="outlined"
            autoFocus>
            Yes, let&apos;s fly
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
