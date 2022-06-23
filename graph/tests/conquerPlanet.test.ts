import { PlanetConquer } from '../generated/Players/Players'
import { Address, ethereum } from "@graphprotocol/graph-ts";
import { newMockEvent, test, assert, logStore, clearStore } from "matchstick-as/assembly/index";
import { handlePlanetConquer } from '../src/players'
import { PlanetConquerEntity } from "../generated/schema"

export function createPlanetConquerEvent(player: string, amount: i32, planetType: i32): PlanetConquer {
    let newPlanetConquerEvent = changetype<PlanetConquer>(newMockEvent())
    newPlanetConquerEvent.parameters = new Array()
    let amountParam = new ethereum.EventParam("amount", ethereum.Value.fromI32(amount))
    let playerParam = new ethereum.EventParam("player", ethereum.Value.fromAddress(Address.fromString(player)))
    let planetTypeParam = new ethereum.EventParam("planetType", ethereum.Value.fromI32(planetType))

    newPlanetConquerEvent.parameters.push(playerParam)
    newPlanetConquerEvent.parameters.push(amountParam)
    newPlanetConquerEvent.parameters.push(planetTypeParam)

    return newPlanetConquerEvent
} 

test("Can handle planet conquer event", () => {
    let newPlanetConquerEvent = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 10, 1)

    handlePlanetConquer(newPlanetConquerEvent);
    logStore();

    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "totalYield", "10");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "id", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a");
    assert.fieldEquals("PlanetConquerEntity", "0xa16081f360e3847006db660bae1c6d1b2e17ec2a", "numSyncs", "1");

    clearStore();
})

test("Tallies yield amount correctly", () => {
    // arrange
    let newStepsAddedEvent1 = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 25, 1);
    let newStepsAddedEvent2 = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 45, 1);
    let newStepsAddedEvent3 = createPlanetConquerEvent("0xa16081f360e3847006db660bae1c6d1b2e17ec2a", 50, 1);

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
