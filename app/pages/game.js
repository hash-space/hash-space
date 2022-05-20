import { PageWrapper } from '../src/components/PageWrapper';
import { Paper } from '@mui/material';
import { useWindowSize } from '../src/hooks/useWindowSize';
import GameComponent from '../src/components/GameComponent';
import { useWorldContract, useNftContract } from '../src/context/state';

export default function Game() {
  const size = useWindowSize();
  const worldContract = useWorldContract();
  const nftContract = useNftContract();

  const leftRightPadding = size.width > 800 ? 50 : 0;
  const height = size.height - 110;

  const isLoaded =
    height > 0 &&
    worldContract.planets.length > 0 &&
    nftContract.ships.length > 0;

  return (
    <PageWrapper>
      <div style={{ height: 20 }}></div>

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
                steps={1000}
              />
            )}
          </div>
        </Paper>
      </div>
    </PageWrapper>
  );
}
