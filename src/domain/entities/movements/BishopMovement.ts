import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";

export class BishopMovement implements MovementValidator {
  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    return delta.x !== 0 && Math.abs(delta.x) === Math.abs(delta.y);
  }
}
