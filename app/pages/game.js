import { useEffect, useRef, useState } from 'react';
import { PageWrapper } from '../src/components/PageWrapper';
import { Paper } from '@mui/material';
import { useWindowSize } from '../src/hooks/useWindowSize';
import GameComponent from '../src/components/GameComponent';
import { useWorldContract } from '../src/context/state';

const SHIPS = [
  {
    x: 0,
    y: 100,
    id: 1,
    category: 'NotMe',
  },
  {
    x: 300,
    y: 500,
    id: 1,
    category: 'NotMe',
  },
  {
    x: 400,
    y: 200,
    id: 1,
    category: 'NotMe',
  },
  {
    x: 650,
    y: 300,
    id: 1,
    category: 'NotMe',
  },
  {
    x: 100,
    y: 100,
    id: 2,
    isMine: true,
    category: 'Me',
  },
];

export default function Game() {
  const size = useWindowSize();
  const worldContract = useWorldContract();

  const leftRightPadding = size.width > 800 ? 50 : 0;
  const height = size.height - 110;

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
            {height > 0 && worldContract.planets.length > 0 && (
              <GameComponent
                ships={SHIPS}
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
