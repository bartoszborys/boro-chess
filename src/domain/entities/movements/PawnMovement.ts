import { Coordinates, MovementValidator } from "./MovementValidator";

export class PawnMovement implements MovementValidator {
  canMove(_from: Coordinates, _to: Coordinates): boolean {
    return true;
  }
}
