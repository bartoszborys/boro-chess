import { Figure } from "@/domain/entities/Figure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { WhitePawnMovement } from "@/domain/entities/movements/WhitePawnMovement";
import { DirectionsBuilder } from "./domain/DirectionsBuilder";

const pawn = new Figure(new Coordinates(0, 0), {
    canMove: () => true,
    getDirections: () => DirectionsBuilder.create().build(),
    getThroughCoordinates: () => [],
});

console.log(pawn.moveTo(new Coordinates(0, 1)));
console.log(pawn.moveTo(new Coordinates(0, 121)));
