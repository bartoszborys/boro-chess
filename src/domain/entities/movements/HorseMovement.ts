import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import type { MovementValidator } from "./MovementValidator";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";

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

  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addCustomDirection(2, 1, { maxRange: 1 })
      .addCustomDirection(2, -1, { maxRange: 1 })
      .addCustomDirection(-2, 1, { maxRange: 1 })
      .addCustomDirection(-2, -1, { maxRange: 1 })
      .addCustomDirection(1, 2, { maxRange: 1 })
      .addCustomDirection(1, -2, { maxRange: 1 })
      .addCustomDirection(-1, 2, { maxRange: 1 })
      .addCustomDirection(-1, -2, { maxRange: 1 })
      .build();
  }

  getThroughCoordinates(_movement: Movement): Coordinates[] {
    return [];
  }
}
