import type { Movement } from "@/domain/entities/Movement";
import type { MovementValidator } from "./MovementValidator";

export class KingMovement implements MovementValidator {
  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();
    const absoluteX = Math.abs(delta.x);
    const absoluteY = Math.abs(delta.y);

    return (
      absoluteX <= 1 && absoluteY <= 1 && (absoluteX !== 0 || absoluteY !== 0)
    );
  }
}
