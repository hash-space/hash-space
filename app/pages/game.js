import { PageWrapper } from '../src/components/PageWrapper';
import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Paper } from '@mui/material';
import { useWindowSize } from '../src/hooks/useWindowSize';
import GameComponent from '../src/components/GameComponent';
import {
  useWorldContract,
  useNftContract,
  usePlayerContract,
} from '../src/context/state';
import { useRouter } from 'next/router';
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
  const worldContract = useWorldContract();
  const nftContract = useNftContract();
  const playerContract = usePlayerContract();
  const router = useRouter();
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
    return nftContract.ships.find((s) => s.isMine);
  }, [nftContract.ships]);

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
    nftContract.ships.length > 0;

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
                ships={nftContract.ships}
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
              Are you sure you want to move your ship over a distance of
              Distance: {props.distance} , Steps: {props.stepsNeeded}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} variant="text">
            Close
          </Button>
          <Button
            disabled={stepsMissing}
            onClick={props.confirmMove}
            color="secondary"
            variant="outlined"
            autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
