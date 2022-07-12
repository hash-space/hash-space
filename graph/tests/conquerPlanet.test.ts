import { PlanetConquer } from '../generated/Players/Players'
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent, test, assert, logStore, clearStore } from "matchstick-as/assembly/index";
import { handlePlanetConquer } from '../src/players'
import { PlanetConquerEntity } from "../generated/schema"

export function createPlanetConquerEvent(player: string, amount: i32, planetType: i32, timestamp: i32): PlanetConquer {
    let newPlanetConquerEvent = changetype<PlanetConquer>(newMockEvent())
    newPlanetConquerEvent.parameters = new Array()
    let amountParam = new ethereum.EventParam("amount", ethereum.Value.fromI32(amount))
    let playerParam = new ethereum.EventParam("player", ethereum.Value.fromAddress(Address.fromString(player)))
    let planetTypeParam = new ethereum.EventParam("planetType", ethereum.Value.fromI32(planetType))
    let timestampParam = new ethereum.EventParam("timestamp", ethereum.Value.fromI32(timestamp))

    newPlanetConquerEvent.parameters.push(playerParam)
    newPlanetConquerEvent.parameters.push(amountParam)
    newPlanetConquerEvent.parameters.push(planetTypeParam)
    newPlanetConquerEvent.parameters.push(timestampParam)

    return newPlanetConquerEvent
} 

test("Can handle planet conquer event", () => {
    let newPlanetConquerEvent = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 10, 1, 10)

    handlePlanetConquer(newPlanetConquerEvent);
    logStore();

    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalYield", "10");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "id", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "1");

    clearStore();
})

test("Tallies yield amount correctly", () => {
    // arrange
    let newStepsAddedEvent1 = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 25, 1, 10);
    let newStepsAddedEvent2 = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 45, 1, 11);
    let newStepsAddedEvent3 = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 50, 1, 12);

    // act
    handlePlanetConquer(newStepsAddedEvent1);
    handlePlanetConquer(newStepsAddedEvent2);
    handlePlanetConquer(newStepsAddedEvent3);
    logStore();

    // assert
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalYield", "120");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "3");

    clearStore();
})

test("Can add yield amount to appropriate week", () => {
    // arrange
    let newYieldAddedEvent_weeka = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 60, 1, 1656003375); // Thu Jun 23 2022 16:56:15 GMT+0000 - week 25
    let newYieldAddedEvent_weekb = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 65, 1, 1655916975); // Wed Jun 22 2022 16:56:15 GMT+0000 - week 25
    let newYieldAddedEvent_weekc = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 70, 1, 1654793775); // Thu Jun 09 2022 16:56:15 GMT+0000 - week 23

    // act
    handlePlanetConquer(newYieldAddedEvent_weeka);
    handlePlanetConquer(newYieldAddedEvent_weekb);
    handlePlanetConquer(newYieldAddedEvent_weekc);
    logStore();

    // assert
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalYield", "195");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "3");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "week25Yield", "125");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "week23Yield", "70");


    clearStore();

})
