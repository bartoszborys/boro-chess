import { Coordinates, MovementValidator } from "./MovementValidator";

export class KingMovement implements MovementValidator {
  canMove(_from: Coordinates, _to: Coordinates): boolean {
    return true;
  }
}
