import { CheesFigure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { DirectionsBuilder } from "./domain/DirectionsBuilder";

const pawn = new CheesFigure(new Coordinates(0, 0), {
    canMove: () => true,
    getDirections: () => DirectionsBuilder.create().build(),
    getThroughCoordinates: () => [],
});

console.log(pawn.moveTo(new Coordinates(0, 1)));
console.log(pawn.moveTo(new Coordinates(0, 121)));
