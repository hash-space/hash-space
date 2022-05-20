const LOCATION_POINTS_PER_STEP = 10;

export function calcDistance(point1, point2) {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
}

export function stepsToDistance(steps) {
  return Math.trunc(steps / LOCATION_POINTS_PER_STEP);
}

export function distanceToSteps(distance) {
  return Math.trunc(distance * LOCATION_POINTS_PER_STEP);
}
