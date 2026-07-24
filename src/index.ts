import { Coordinates, Figure } from "@/domain/entities/Figure";
import { WhitePawnMovement } from "@/domain/entities/movements/WhitePawnMovement";

const pawn = new Figure(0, 0, new WhitePawnMovement(new Coordinates(0, 0)));

console.log(pawn.moveTo(new Coordinates(0, 1)));
console.log(pawn.moveTo(new Coordinates(0, 121)));
