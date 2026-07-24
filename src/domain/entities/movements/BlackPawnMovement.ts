import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class BlackPawnMovement implements MovementValidator {
  constructor(private readonly startingPosition: Coordinates) {}

  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    if (!movement.capturing && delta.x !== 0) {
      return false;
    }

    if (movement.capturing && (Math.abs(delta.x) !== 1 || delta.y !== -1)) {
      return false;
    }

    if (delta.y === -1) {
      return true;
    }

    if (delta.y === -2) {
      return movement.from.equals(this.startingPosition);
    }

    return false;
  }

  getCollisionCoordinates(_movement: Movement): Coordinates[] {
    return [];
  }
}
