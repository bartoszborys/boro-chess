import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";

export class TowerMovement implements MovementValidator {
  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    return (delta.x !== 0 && delta.y === 0) || (delta.y !== 0 && delta.x === 0);
  }

  getCollisionCoordinates(_movement: Movement): Coordinates[] {
    return [];
  }
}
