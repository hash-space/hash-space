import * as PIXI from 'pixi.js';
import { useCallback, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';

const LOCATION_POINTS_PER_STEP = 10;

export default function Game(props) {
  const ref = useRef();
  const didMount = useRef();
  const appRef = useRef();

  const getSteps = useCallback(() => {
    return props.steps;
  }, [props.steps]);

  const getShips = useCallback(() => {
    return props.ships;
  }, [props.ships]);

  const getPlanets = useCallback(() => {
    return props.planets;
  }, [props.planets]);

  useEffect(() => {
    if (!didMount.current) {
      initGame(ref.current, { getSteps, getShips, getPlanets }).then((app) => {
        appRef.current = app;
        app.stage.on('targetReached', (playload) => {
          props.eventHandler('targetReached', playload);
        });
        app.stage.on('clickPlanet', (playload) => {
          props.eventHandler('targetReached', playload);
        });
      });
      didMount.current = true;
    }
  }, []);

  return (
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
  );
}

async function initGame(element, reactContext) {
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

  let context = { asset: {}, app, reactContext };
  context = await loadAssets(context);

  const mainContainer = new PIXI.Container();

  // Blue background
  // const graphics = new PIXI.Graphics();
  // graphics.lineStyle(5, 0xffffff, 1);
  // graphics.beginFill(0xf0);
  // graphics.drawRect(0, 0, 2000, 2000);
  // graphics.endFill();
  // mainContainer.height = 2000;
  // mainContainer.width = 2000;
  // mainContainer.addChild(graphics);

  addBackground(app, context);

  // Add mainContainer to the viewport
  viewport.addChild(mainContainer);

  // Add planets to the planet layer
  const containerPlanets = new PIXI.Container();
  mainContainer.addChild(containerPlanets);
  reactContext.getPlanets().forEach((planetElement) => {
    containerPlanets.addChild(planetFactory(context, planetElement));
  });

  // Add ships to ship
  const containerShips = new PIXI.Container();
  mainContainer.addChild(containerShips);
  reactContext.getShips().forEach((shipElement) => {
    containerShips.addChild(shipFactory(context, shipElement));
  });

  app.stage.interactive = true;
  app.stage.hitArea = app.renderer.screen;
  app.stage.on('pointerdown', (e) => {
    if (e.target && e.target.__hashName == 'planet') {
      app.stage.emit('clickPlanet', {
        planet: e.target.__hashMeta,
        x: e.target.position.x,
        y: e.target.position.y,
      });
    }
  });
  return app;
}

async function loadAssets(context) {
  const shipTypes = ['Me', 'NotMe'];
  // const ship = await PIXI.Texture.fromURL('/shipNotMe32.png');
  var ship = {};
  for (const shipType of shipTypes) {
    ship[shipType] = await PIXI.Texture.fromURL('/ship' + shipType + '32.png');
  }
  const planetColors = [
    'Black',
    'Blue',
    'Purple',
    'Teal',
    'Green',
    'Yellow',
    'Orange',
    'Red',
    'Pink',
    'White',
  ];
  var planet = {};
  for (const planetColor of planetColors) {
    planet[planetColor] = await PIXI.Texture.fromURL(
      '/planet' + planetColor + '.png'
    );
  }
  const starTexture = await PIXI.Texture.fromURL('/star.png');
  return { ...context, asset: { ...context.asset, ship, planet, starTexture } };
}

function addBackground(app, context) {
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
      sprite: new PIXI.Sprite(context.asset.starTexture),
      z: 0,
      x: 0,
      y: 0,
    };
    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    randomizeStar(star, true, cameraZ);
    app.stage.addChild(star.sprite);
    stars.push(star);
  }
  app.ticker.add((delta) => {
    // Simple easing. This should be changed to proper easing function when used for real.
    speed += (warpSpeed - speed) / 20;
    cameraZ += delta * 10 * (speed + baseSpeed);
    for (let i = 0; i < starAmount; i++) {
      const star = stars[i];
      if (star.z < cameraZ) randomizeStar(star, false, cameraZ);

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
}

function shipFactory(context, ship) {
  const element = new PIXI.TilingSprite(
    context.asset.ship[ship.category],
    32,
    32
  );
  element.anchor.set(0.5);
  element.x = ship.x + 32;
  element.y = ship.y + 32;
  element.interactive = true;
  element.roundPixels = true;

  element.on('travel', (e) => {
    const stage = context.app.stage;
    const availableDistance =
      context.reactContext.getSteps() * LOCATION_POINTS_PER_STEP; // the distance the user is allowed to travel
    let distance = Math.trunc(calcDistance(element, e)); // the distance the user needs to reach his distination
    let stopDistance = distance;
    // cap distance
    if (availableDistance < stopDistance) {
      stopDistance = availableDistance;
    }

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
      if (delta === stopDistance) {
        console.log('el', stage);
        stage.emit('targetReached', { ship: { x: element.x, y: element.y } });
        return;
      }

      setTimeout(() => {
        requestAnimationFrame(animate);
      }, 1000 / 25);
    }
    requestAnimationFrame(animate);
  });

  return element;
}

function planetFactory(context, planet) {
  const size = 100;
  const element = new PIXI.Sprite(
    context.asset.planet[planet.category],
    size,
    size
  );
  element.anchor.set(0.5);
  element.x = planet.x + (size / 2) * planet.size;
  element.y = planet.y + (size / 2) * planet.size;
  element.scale.set(planet.size);
  element.interactive = true;
  element.roundPixels = true;
  // our metadata
  element.__hashName = 'planet';
  element.__hashMeta = planet;
  return element;
}

function calcDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

function randomizeStar(star, initial, cameraZ) {
  star.z = initial
    ? Math.random() * 2000
    : cameraZ + Math.random() * 1000 + 2000;

  // Calculate star positions with radial random coordinate so no star hits the camera.
  const deg = Math.random() * Math.PI * 2;
  const distance = Math.random() * 50 + 1;
  star.x = Math.cos(deg) * distance;
  star.y = Math.sin(deg) * distance;
}
