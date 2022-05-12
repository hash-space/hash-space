import * as PIXI from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const LOCATION_POINTS_PER_STEP = 10;

export default function Game() {
  const ref = useRef();
  const didMount = useRef();
  const appRef = useRef();
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    if (!didMount.current) {
      init(ref.current).then((app) => {
        appRef.current = app;
        app.stage.steps = steps;
        app.stage.on('updateSteps', (newSteps) => {
          setSteps(newSteps);
        });
      });
      didMount.current = true;
    }
  }, []);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.stage.steps = steps;
    }
  }, [steps]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Steps app</title>
        <meta name="description" content="Steps app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"></meta>
      </Head>
      <p>
        Steps available:{' '}
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value * 1)}></input>
      </p>
      <p>1 step = {LOCATION_POINTS_PER_STEP} location points </p>
      <div ref={ref} style={{ height: '100vh' }}></div>
    </div>
  );
}

const SHIPS = [
  {
    x: 0,
    y: 100,
    id: 1,
  },
  {
    x: 100,
    y: 100,
    id: 2,
    isMine: true,
  },
];

const PLANET = [
  {
    x: 0,
    y: 0,
    id: 1,
    size: 0.5,
  },
  {
    x: 200,
    y: 200,
    id: 1,
    size: 0.5,
  },
  {
    x: 400,
    y: 500,
    id: 1,
    size: 0.5,
  },
  {
    x: 500,
    y: 500,
    id: 1,
    size: 0.5,
  },
  {
    x: 500,
    y: 500,
    id: 1,
    size: 0.5,
  },
  {
    x: 600,
    y: 500,
    id: 1,
    size: 0.5,
  },
  {
    x: 700,
    y: 500,
    id: 1,
    size: 0.5,
  },
];

async function init(element) {
  const app = new PIXI.Application({
    width: element.clientHeight,
    height: element.clientHeight,
    backgroundColor: 0x696969,
    resolution: 1,
  });
  element.appendChild(app.view);
  const { Viewport } = require('pixi-viewport');
  const viewport = new Viewport({
    worldWidth: 2000,
    worldHeight: 2000,

    interaction: app.renderer.plugins.interaction, // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
  });
  app.stage.addChild(viewport);
  viewport.drag().pinch().wheel().decelerate();

  const ship = await PIXI.Texture.fromURL('/procedural-pixel-art.png');
  const planet = await PIXI.Texture.fromURL('/planet.png');
  const context = { asset: { ship, planet }, app };

  const mainContainer = new PIXI.Container();
  const graphics = new PIXI.Graphics();

  // Rectangle
  graphics.lineStyle(5, 0xfeeb77, 1);
  graphics.beginFill(0x000);
  graphics.drawRect(0, 0, 2000, 2000);
  graphics.endFill();
  mainContainer.height = 2000;
  mainContainer.width = 2000;
  mainContainer.addChild(graphics);
  viewport.addChild(mainContainer);

  const containerPlanets = new PIXI.Container();

  // app.stage.on('pointermove', (e) => {
  //   console.log(e);
  // });
  // app.ticker.add(() => {
  //   // just for fun, let's rotate mr rabbit a little
  //   app.stage.pivot.x += 0.1;
  // });

  mainContainer.addChild(containerPlanets);
  PLANET.forEach((planet) => {
    addPlanet(planet, { ...context, stage: containerPlanets });
  });

  const containerShips = new PIXI.Container();
  mainContainer.addChild(containerShips);
  SHIPS.forEach((ship) => {
    addShip(ship, { ...context, stage: containerShips });
  });

  app.stage.interactive = true;
  app.stage.hitArea = app.renderer.screen;
  app.stage.on('pointerdown', (e) => {
    // console.log(e);
    if (e.target && e.target.name == 'planet') {
      const myShip = SHIPS.find((i) => i.isMine);

      const distance = calcDistance(myShip.element, e.target.position);
      if (app.stage.steps == 0) {
        alert('you dont have enough steps to move');
      } else {
        const result = confirm(
          `do you want to travel ${Math.trunc(
            distance / LOCATION_POINTS_PER_STEP
          )}, you have ${app.stage.steps} available?`
        );

        if (result) {
          myShip.element.emit('travel', {
            x: e.target.position.x,
            y: e.target.position.y,
          });
        }
      }
    }
  });
  return app;
}

function addShip(ship, context) {
  const element = new PIXI.TilingSprite(context.asset.ship, 32, 32);
  element.anchor.set(0.5);
  element.x = ship.x + 32;
  element.y = ship.y + 32;
  element.interactive = true;
  element.roundPixels = true;
  ship.element = element;

  context.stage.addChild(element);

  element.on('travel', (e) => {
    const stage = context.app.stage;
    const availableDistance = stage.steps * LOCATION_POINTS_PER_STEP; // the distance the user is allowed to travel
    let distance = Math.trunc(calcDistance(element, e)); // the distance the user needs to reach his distination
    let stopDistance = distance;
    // cap distance
    if (availableDistance < stopDistance) {
      stopDistance = availableDistance;
    }
    const distanceDelta = Math.trunc(
      (availableDistance - stopDistance) / LOCATION_POINTS_PER_STEP
    );
    // console.log({ availableDistance, distance, distanceDelta });

    // math stuff
    let delta = 0.0;
    const targetX = e.x;
    const targetY = e.y;
    const deltaX = (targetX - element.x) / distance;
    const deltaY = (targetY - element.y) / distance;
    function animate() {
      element.x += deltaX;
      element.y += deltaY;
      delta += 1;
      // console.log(
      //   JSON.stringify(
      //     {
      //       delta,
      //       c: [element.x, e.x],
      //       y: [element.y, e.y],
      //     },
      //     null,
      //     2
      //   )
      // );
      if (delta === stopDistance) {
        console.log('el', stage);
        stage.emit('updateSteps', distanceDelta);
        return;
      }

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / 25);
    }
    requestAnimationFrame(animate);
  });
}

function addPlanet(planet, context) {
  const size = 100;
  const element = new PIXI.Sprite(context.asset.planet, size, size);
  element.anchor.set(0.5);
  element.x = planet.x + (size / 2) * planet.size;
  element.y = planet.y + (size / 2) * planet.size;
  element.scale.set(planet.size);
  element.interactive = true;
  element.roundPixels = true;
  element.name = 'planet';
  planet.element = element;

  context.stage.addChild(element);
}

function calcDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}
