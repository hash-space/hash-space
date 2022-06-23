import { StepsAdded } from '../generated/Players/Players'
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent, test, assert, logStore, clearStore } from "matchstick-as/assembly/index";
import { handleStepsAdded } from '../src/players'
import { StepTrackingEntity } from "../generated/schema"

export function createNewStepsAddedEvent(stepsTaken: i32, player: string, timestamp: i32): StepsAdded {
    let newStepsAddedEvent = changetype<StepsAdded>(newMockEvent())
    newStepsAddedEvent.parameters = new Array()
    let stepsTakenParam = new ethereum.EventParam("stepsTaken", ethereum.Value.fromI32(stepsTaken))
    let playerParam = new ethereum.EventParam("player", ethereum.Value.fromAddress(Address.fromString(player)))
    let timestampParam = new ethereum.EventParam("timestamp", ethereum.Value.fromI32(timestamp))

    newStepsAddedEvent.parameters.push(stepsTakenParam)
    newStepsAddedEvent.parameters.push(playerParam)
    newStepsAddedEvent.parameters.push(timestampParam)

    return newStepsAddedEvent
} 

test("Can handle StepsAdded", () => {
    let newStepsAddedEvent = createNewStepsAddedEvent(5, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 10);

    handleStepsAdded(newStepsAddedEvent);
    // logStore(); // optional: to view the entity

    assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalSteps", "5");
    assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "id", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a");
    assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "1");

    clearStore(); // clear logs - necessary to prevent carry forward to next test
})

test("Can handle two stepsAdded events correctly", () => {
    let newStepsAddedEvent1 = createNewStepsAddedEvent(60, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 10);
    let newStepsAddedEvent2 = createNewStepsAddedEvent(35, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 11);

    handleStepsAdded(newStepsAddedEvent1);
    handleStepsAdded(newStepsAddedEvent2);
    // logStore(); // optional: to view the entity

    assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalSteps", "95");
    assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "id", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a");
    assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "2");

    clearStore();
})

// test("Can add stepsAdded to appropriate week", () => {
//     // arrange
//     let newStepsAddedEvent_weeka = createNewStepsAddedEvent(60, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 1655815016);
//     let newStepsAddedEvent_weekb = createNewStepsAddedEvent(65, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 1655815017);
//     let newStepsAddedEvent_weekc = createNewStepsAddedEvent(70, "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 1655917730);
//        // Note: week a and week b are 1 second either side of the week 1 / week 2 boundary

//     // act
//     handleStepsAdded(newStepsAddedEvent_weeka);
//     handleStepsAdded(newStepsAddedEvent_weekb);
//     handleStepsAdded(newStepsAddedEvent_weekc);
//     logStore();

//     // assert
//     assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalSteps", "195");
//     assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "3");
//     assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "week1Steps", "60");
//     // assert.fieldEquals("StepTrackingEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "week2Steps", "135");
//         // TODO: resolve multi-sync in same week, then uncomment above (currently failing)

//     clearStore();

// })