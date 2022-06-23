import { BigInt, Value } from '@graphprotocol/graph-ts';
import { StepsAdded } from '../generated/Players/Players';
import { StepTrackingEntity } from '../generated/schema';
// import { log } from '@graphprotocol/graph-ts';

export function handleStepsAdded(event: StepsAdded): void {
  let entity = StepTrackingEntity.load(event.transaction.from.toHex());

  if (!entity) {
    entity = new StepTrackingEntity(event.transaction.from.toHex());
    entity.numSyncs = BigInt.fromI32(0);
    entity.totalSteps = BigInt.fromI32(0);
  }

  entity.numSyncs = entity.numSyncs.plus(BigInt.fromI32(1));
  entity.totalSteps = entity.totalSteps.plus(event.params.stepsTaken);

  var currentDate = new Date(
    event.params.timestamp.times(BigInt.fromString('1000')).toI64()
  );
  const firstJanThisYear = new Date(0);
  firstJanThisYear.setUTCDate(1);
  firstJanThisYear.setUTCFullYear(currentDate.getUTCFullYear());
  firstJanThisYear.setUTCHours(1);
  firstJanThisYear.setUTCMinutes(1);
  firstJanThisYear.setUTCSeconds(1);

  var diff = (currentDate.getTime() - firstJanThisYear.getTime()) as f64;
  var dayNumber = Math.floor(diff / (24 * 60 * 60 * 1000));
  var weekNum = BigInt.fromI32(Math.ceil(dayNumber / 7) as i32).toI32();
  var keyName = `week${weekNum}Steps`;

  if (entity.isSet(keyName)) {
    let prevStepsThisWeek = entity.get(keyName);
    if (!prevStepsThisWeek) throw new Error('error');

    let newStepsThisWeek = event.params.stepsTaken.plus(
      prevStepsThisWeek.toBigInt()
    );

    entity.set(keyName, Value.fromBigInt(newStepsThisWeek));
  } else {
    entity.set(keyName, Value.fromBigInt(event.params.stepsTaken));
  }

  entity.save();
}
