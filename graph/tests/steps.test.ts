import { StepsAdded } from '../generated/Players/Players'
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent, test, assert } from "matchstick-as/assembly/index";
import { handleStepsAdded } from '../src/players'

export function createNewStepsAddedEvent(stepsTaken: i32, player: address, timestamp: i32 ): StepsAdded {
    let newStepsAddedEvent = changetype<StepsAdded>(newMockEvent())
    newStepsAddedEvent.parameters = new.Array()
    let idParam = new ethereum.EventParam("id", ethereum.Value.fromI32(stepsTaken)) // TODO: deal with ID param properly
    let stepsTakenParam = new ethereum.EventParam("stepsTaken", ethereum.Value.fromI32(stepsTaken))
    let playerParam = new ethereum.EventParam("player", ethereum.Value.fromAddress(Address.fromString(player)))
    let timestampParam = new ethereum.EventParam("timestamp", ethereum.Value.fromI32(timestamp))

    newStepsAddedEvent.parameters.push(idParam)
    newStepsAddedEvent.parameters.push(stepsTakenParam)
    newStepsAddedEvent.parameters.push(playerParam)
    newStepsAddedEvent.parameters.push(timestampParam)

    return newStepsAddedEvent
} 



test("Can handle StepsAdded", () => {
    let newStepsAddedEvent = createNewStepsAddedEvent(50, "0x8d3b5Bd6CeB7217c537411D976DB557f80E64487", 1050);

    handleStepsAdded(newStepsAddedEvent);

    assert.fieldEquals("StepTrackingEntity", "50", "address", "0x8d3b5Bd6CeB7217c537411D976DB557f80E64487")
        // I need the id apparently?

})
