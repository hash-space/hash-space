import { StepsAdded } from '../generated/Players/Players'
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent, test, assert, logStore } from "matchstick-as/assembly/index";
import { handleStepsAdded } from '../src/players'

export function createNewStepsAddedEvent(stepsTaken: i32, player: string, timestamp: i32): StepsAdded {
    let newStepsAddedEvent = changetype<StepsAdded>(newMockEvent())
    newStepsAddedEvent.parameters = new Array()
    // let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(stepsTaken)) // TODO: deal with ID param properly
        // TODO: update to use the address, which the StepTrackingEntity uses for ID
    let stepsTakenParam = new ethereum.EventParam("stepsTaken", ethereum.Value.fromI32(stepsTaken))
    let playerParam = new ethereum.EventParam("player", ethereum.Value.fromAddress(Address.fromString(player)))
    let timestampParam = new ethereum.EventParam("timestamp", ethereum.Value.fromI32(timestamp))

    // newStepsAddedEvent.parameters.push(idParam)
    newStepsAddedEvent.parameters.push(stepsTakenParam)
    newStepsAddedEvent.parameters.push(playerParam)
    newStepsAddedEvent.parameters.push(timestampParam)

    return newStepsAddedEvent
} 



test("Can handle StepsAdded", () => {
    let newStepsAddedEvent = createNewStepsAddedEvent(5, "0x8d3b5Bd6CeB7217c537411D976DB557f80E64487", 5);

    handleStepsAdded(newStepsAddedEvent);

    logStore();

    assert.equals(ethereum.Value.fromI32(1),ethereum.Value.fromI32(1))
    // assert.equals(ethereum.Value.fromI32(StepTrackingEntity.totalSteps.data), ethereum.Value.fromI32(5));

    // how to access stuff in store?

})
