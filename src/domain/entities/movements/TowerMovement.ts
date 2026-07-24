import type { Movement } from "@/domain/entities/Movement";
import type { MovementValidator } from "./MovementValidator";

export class TowerMovement implements MovementValidator {
  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    return (delta.x !== 0 && delta.y === 0) || (delta.y !== 0 && delta.x === 0);
  }
}
