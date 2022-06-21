import { BigInt, Value } from "@graphprotocol/graph-ts"
import {
  Players,
  StepsAdded,
  PlanetConquer
} from "../generated/Players/Players"
import { StepTrackingEntity } from "../generated/schema"

export function handleStepsAdded(event: StepsAdded): void {
  let entity = StepTrackingEntity.load(event.transaction.from.toHex())

  if (!entity) {
    entity = new StepTrackingEntity(event.transaction.from.toHex())
    entity.numSyncs = BigInt.fromI32(0)
    entity.totalSteps = BigInt.fromI32(0)
  }

  // Get the week number of this version of the game
  let startTimeUnix = "1655210217"
  let startingTimestamp = BigInt.fromString(startTimeUnix) // unix time when contract deployed - to update
  let stepsAddedTimestamp = BigInt.fromString(event.params.timestamp.toString())
  let delta_in_seconds = stepsAddedTimestamp.minus(startingTimestamp)
  let delta_in_weeks = delta_in_seconds.div(BigInt.fromI32(60*60*24*7))
  // TODO: check whether appropriately rounds up / down once more than 1 week has passed
  // It appears to give floor (ie. round down), which is desired behaviour
  let weekNum = delta_in_weeks +  BigInt.fromI32(1);

  entity.set(`week${weekNum}Steps`, Value.fromBigInt(event.params.stepsTaken))
  entity.numSyncs = entity.numSyncs + BigInt.fromI32(1)
  entity.totalSteps = entity.totalSteps + event.params.stepsTaken

  entity.save()
}

// export function handlePlanetConquer(event: PlanetConquer): void {
  
// }

