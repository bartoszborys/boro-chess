import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";

export class HorseMovement implements MovementValidator {
  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();
    const absoluteX = Math.abs(delta.x);
    const absoluteY = Math.abs(delta.y);

    return (
      (absoluteX === 2 && absoluteY === 1) ||
      (absoluteX === 1 && absoluteY === 2)
    );
  }
}
