import * as PIXI from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { PageWrapper } from '../src/components/PageWrapper';
import { Paper, CircularProgress } from '@mui/material';
import { useWindowSize } from '../src/hooks/useWindowSize';

const LOCATION_POINTS_PER_STEP = 10;

export default function Game() {
  const ref = useRef();
  const didMount = useRef();
  const appRef = useRef();
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    if (appRef.current) {
      appRef.current.stage.steps = steps;
    }
  }, [steps]);

  const size = useWindowSize();

  const leftRightPadding = size.width > 800 ? 50 : 0;
  const height = size.height - 110;

  useEffect(() => {
    if (!didMount.current && height > 0) {
      init(ref.current).then((app) => {
        appRef.current = app;
        app.stage.steps = steps;
        app.stage.on('updateSteps', (newSteps) => {
          setSteps(newSteps);
        });
      });
      didMount.current = true;
    }
  }, [height]);

  return (
    <PageWrapper>
      {/* <p>
        <input
          type="number"
          value={steps}
          onChange={(e) => setSteps(e.target.value * 1)}></input>
      </p> */}
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
            <div
              ref={ref}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}>
              <CircularProgress />
            </div>
          </div>
        </Paper>
      </div>
    </PageWrapper>
  );
}

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

const PLANET = [
  {
    x: 10,
    y: 50,
    id: 1,
    size: 0.5,
    category:'Black',
  },
  {
    x: 750,
    y: 600,
    id: 1,
    size: 0.5,
    category:'Purple',
  },
  {
    x: 350,
    y: 650,
    id: 1,
    size: 0.5,
    category:'Blue',
  },
  {
    x: 50,
    y: 350,
    id: 1,
    size: 0.5,
    category:'Teal',
  },
  {
    x: 700,
    y: 300,
    id: 1,
    size: 0.5,
    category:'Green',
  },
  {
    x: 450,
    y: 700,
    id: 1,
    size: 0.5,
    category:'Yellow',
  },
  {
    x: 200,
    y: 300,
    id: 1,
    size: 0.5,
    category:'Orange',
  },
  {
    x: 600,
    y: 500,
    id: 1,
    size: 0.5,
    category:'Red',
  },
  {
    x: 350,
    y: 350,
    id: 1,
    size: 0.5,
    category:'Pink',
  },
  {
    x: 750,
    y: 50,
    id: 1,
    size: 0.5,
    category:'White',
  },
];

async function init(element) {
  const app = new PIXI.Application({
    width: element.clientWidth,
    height: element.clientHeight,
    backgroundColor: 0x000000, //0x696969,
    resolution: 1,
  });
  [...element.children].forEach((child) => {
    element.removeChild(child);
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
  const shipTypes = ['Me','NotMe']
  // const ship = await PIXI.Texture.fromURL('/shipNotMe32.png');
  var ship = {};
  for (const shipType of shipTypes){
    ship[shipType] = await PIXI.Texture.fromURL('/ship'+shipType+'32.png');
  }
  const planetColors = ['Black','Blue','Purple','Teal','Green','Yellow','Orange','Red','Pink','White'];
  var planet = {};
  for (const planetColor of planetColors){
    planet[planetColor] = await PIXI.Texture.fromURL('/planet'+planetColor+'.png');
  }
  // const planet = await PIXI.Texture.fromURL('/planet'+planetColors[0]+'.png');
  const context = { asset: { ship, planet }, app };

  const BGTexture = await PIXI.Texture.fromURL('/backgroundTile.png');

  const mainContainer = new PIXI.Container();
  const graphics = new PIXI.Graphics();

  // Rectangle
  // graphics.lineStyle(5, 0xffffff, 1);
  // graphics.beginFill(0xf0);
  graphics.drawRect(0, 0, 2000, 2000);
  graphics.endFill();
  mainContainer.height = 2000;
  mainContainer.width = 2000;
  mainContainer.addChild(graphics);

  // Add background tiling texture to mainContainer
  // const TilingSprite = new PIXI.TilingSprite(
  //   BGTexture,
  //   mainContainer.width,
  //   mainContainer.height,
  // );
  // mainContainer.addChild(TilingSprite);

  // ========================================
  // Stary background START
  const starTexture = await PIXI.Texture.fromURL('/star.png');

  const starAmount = 1000;
  let cameraZ = 0;
  const fov = 20;
  const baseSpeed = 0.025;
  let speed = 0;
  let warpSpeed = 0;
  const starStretch = 5;
  const starBaseSize = 0.05;

  // Create the stars
  const stars = [];
  for (let i = 0; i < starAmount; i++) {
    const star = {
      sprite: new PIXI.Sprite(starTexture),
      z: 0,
      x: 0,
      y: 0,
    };
    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    randomizeStar(star, true);
    app.stage.addChild(star.sprite);
    stars.push(star);
  }

  function randomizeStar(star, initial) {
    star.z = initial
      ? Math.random() * 2000
      : cameraZ + Math.random() * 1000 + 2000;

    // Calculate star positions with radial random coordinate so no star hits the camera.
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;
    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
  }

  // Change flight speed every 5 seconds
  // setInterval(() => {
  //   warpSpeed = warpSpeed > 0 ? 0 : 1;
  // }, 5000);

  // Listen for animate update
  app.ticker.add((delta) => {
    // Simple easing. This should be changed to proper easing function when used for real.
    speed += (warpSpeed - speed) / 20;
    cameraZ += delta * 10 * (speed + baseSpeed);
    for (let i = 0; i < starAmount; i++) {
      const star = stars[i];
      if (star.z < cameraZ) randomizeStar(star);

      // Map star 3d position to 2d with really simple projection
      const z = star.z - cameraZ;
      star.sprite.x =
        star.x * (fov / z) * app.renderer.screen.width +
        app.renderer.screen.width / 2;
      star.sprite.y =
        star.y * (fov / z) * app.renderer.screen.width +
        app.renderer.screen.height / 2;

      // Calculate star scale & rotation.
      const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
      const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
      const distanceCenter = Math.sqrt(
        dxCenter * dxCenter + dyCenter * dyCenter
      );
      const distanceScale = Math.max(0, (2000 - z) / 2000);
      star.sprite.scale.x = distanceScale * starBaseSize;
      // Star is looking towards center so that y axis is towards center.
      // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
      star.sprite.scale.y =
        distanceScale * starBaseSize +
        (distanceScale * speed * starStretch * distanceCenter) /
          app.renderer.screen.width;
      star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    }
  });
  // Stary background END
  // ========================================

  // Add mainContainer to the viewport
  viewport.addChild(mainContainer);

  // app.stage.on('pointermove', (e) => {
  //   console.log(e);
  // });
  // app.ticker.add(() => {
  //   // just for fun, let's rotate mr rabbit a little
  //   app.stage.pivot.x += 0.1;
  // });

  const containerPlanets = new PIXI.Container();
  mainContainer.addChild(containerPlanets);
  PLANET.forEach((planetElement) => {
    addPlanet(planetElement, { ...context, stage: containerPlanets });
  });

  const containerShips = new PIXI.Container();
  mainContainer.addChild(containerShips);
  SHIPS.forEach((shipElement) => {
    addShip(shipElement, { ...context, stage: containerShips });
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
  const element = new PIXI.TilingSprite(context.asset.ship[ship.category], 32, 32);
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
  const element = new PIXI.Sprite(context.asset.planet[planet.category], size, size);
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
