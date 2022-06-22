import { BigInt, Value } from "@graphprotocol/graph-ts"
import {
  Players,
  StepsAdded,
  PlanetConquer
} from "../generated/Players/Players"
import { StepTrackingEntity, ConquerPlanetEntity } from "../generated/schema"

// TODO: add helper function here to calculate which week we're in, or 
// load it from outside
// probably use from below

export function handleStepsAdded(event: StepsAdded): void {
  let entity = StepTrackingEntity.load(event.transaction.from.toHex())

  if (!entity) {
    entity = new StepTrackingEntity(event.transaction.from.toHex())
    entity.numSyncs = BigInt.fromI32(0)
    entity.totalSteps = BigInt.fromI32(0)
  }

  entity.numSyncs = entity.numSyncs + BigInt.fromI32(1)
  entity.totalSteps = entity.totalSteps + event.params.stepsTaken

  // Get the week number of this version of the game
  let startTimeUnix = "1655210217" // unix seconds between game beginning (contract deployment) and 1970 
  let startingTimestamp = BigInt.fromString(startTimeUnix)
  let stepsAddedTimestamp = BigInt.fromString(event.params.timestamp.toString())
  let delta_in_seconds = stepsAddedTimestamp.minus(startingTimestamp)
  let delta_in_weeks = delta_in_seconds.div(BigInt.fromI32(60*60*24*7))
  // TODO: check whether appropriately rounds up / down once more than 1 week has passed
  // It appears to give floor (ie. round down), which is desired behaviour
  let weekNum = delta_in_weeks +  BigInt.fromI32(1);

  if (entity.isSet(`week${weekNum}Steps`)) {
    let prevStepsThisWeek = entity.get(`week${weekNum}Steps`)?.data

    let newStepsThisWeek = event.params.stepsTaken // .plus(BigInt.fromI32(prevStepsThisWeek))
    // TODO: figure out how to combine the existing steps and new steps (having Type issues)

    // entity.set(`week${weekNum}Steps`, Value.fromBigInt(newStepsThisWeek))
    entity.set(`week${weekNum}Steps`, Value.fromBigInt(newStepsThisWeek))


  } else {
  entity.set(`week${weekNum}Steps`, Value.fromBigInt(event.params.stepsTaken)) 
    // TODO: resolve issue leading to this being null
  }

  entity.save()
}

export function handlePlanetConquer(event: PlanetConquer): void {
  let entity = ConquerPlanetEntity.load(event.transaction.from.toHex())
  
  if (!entity) {
    entity = new ConquerPlanetEntity(event.transaction.from.toHex())
    entity.numSyncs = BigInt.fromI32(0)
    entity.totalYield = BigInt.fromI32(0)
  }

  // TODO: add in the weekly yield calculations 

  entity.numSyncs = entity.numSyncs + BigInt.fromI32(1)
  entity.totalYield = entity.totalYield + event.params.amount

  entity.save()
}

