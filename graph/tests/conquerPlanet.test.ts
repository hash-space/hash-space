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
    clearStore();
})