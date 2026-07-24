import { Coordinates, MovementValidator } from "./MovementValidator";

export class QueenMovement implements MovementValidator {
  canMove(_from: Coordinates, _to: Coordinates): boolean {
    return true;
  }
}
