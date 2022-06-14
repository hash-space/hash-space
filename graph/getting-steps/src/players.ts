import { BigInt } from "@graphprotocol/graph-ts"
import {
  Players,
  StepsAdded
} from "../generated/Players/Players"
import { StepTrackingEntity } from "../generated/schema"

// import dayjs from '../node_modules/dayjs'
// dayjs().format()
// import moment from 'moment';
// moment.format()

export function handleStepsAdded(event: StepsAdded): void {
  let entity = StepTrackingEntity.load(event.transaction.from.toHex())

  if (!entity) {
    entity = new StepTrackingEntity(event.transaction.from.toHex())
    entity.numSyncs = BigInt.fromI32(0)
    entity.totalSteps = BigInt.fromI32(0)
    entity.timestamp = BigInt.fromI32(0)
  }

  let start_time_unix = "1655206617"
  let week_1_timestamp = BigInt.fromString(start_time_unix) // unix time when contract deployed - to update
  let week_num = BigInt.fromString(event.params.timestamp.toString())
  // let delta: any = week_num - week_1_timestamp
  // entity.timestamp = week_num - week_1_timestamp

  // entity.timestamp = moment.unix(event.params.timestamp);

  // TODO: use timestamp to parse into weeks, rather than save as parameter
  // let week_number = timestamp // TODO: convert timestamp into a week number
  // May want to subtract timestamp from the start of subgraph, to get week numbers

  entity.numSyncs = entity.numSyncs + BigInt.fromI32(1)

  entity.totalSteps = entity.totalSteps + event.params.stepsTaken

  entity.save()

  // TODO: consider not using event outputs, but rather calls to the contract
  // as below.
  

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.NFTPRICE(...)
  // - contract.checkContractBalance(...)s
  // - contract.determineStartingPosition(...)
  // - contract.indexStartingPosition(...)
  // - contract.owner(...)
  // - contract.players(...)
}
