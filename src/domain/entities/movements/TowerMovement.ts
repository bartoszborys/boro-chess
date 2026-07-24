import { Coordinates, MovementValidator } from "./MovementValidator";

export class TowerMovement implements MovementValidator {
  canMove(_from: Coordinates, _to: Coordinates): boolean {
    return true;
  }
}
