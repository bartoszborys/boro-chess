import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
import type { Direction } from "@/domain/value-objects/Direction";
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

  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopDirection({ maxRange: 1 })
      .addTopRightDirection({ maxRange: 1 })
      .addTopLeftDirection({ maxRange: 1 })
      .addBottomDirection({ maxRange: 1 })
      .addBottomRightDirection({ maxRange: 1 })
      .addBottomLeftDirection({ maxRange: 1 })
      .addLeftDirection({ maxRange: 1 })
      .addRightDirection({ maxRange: 1 })
      .build();
  }

  getCollisionCoordinates(_movement: Movement): Coordinates[] {
    return [];
  }
}
