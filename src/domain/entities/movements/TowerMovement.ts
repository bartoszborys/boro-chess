import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
import type { MovementValidator } from "./MovementValidator";
import { Direction } from "@/domain/value-objects/Direction";

export class TowerMovement implements MovementValidator {
  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addLeftDirection()
      .addRightDirection()
      .addTopDirection()
      .addBottomDirection()
      .build();
  }

  getThroughCoordinates(movement: Movement): Coordinates[] {
    const delta = movement.calculateDelta();
    const stepsCount = Math.abs(delta.x) + Math.abs(delta.y);
    const stepX = Math.sign(delta.x);
    const stepY = Math.sign(delta.y);

    const path: Coordinates[] = [];

    for (let currentStep = 1; currentStep < stepsCount; currentStep++) {
      path.push(
        new Coordinates(
          movement.from.x + stepX * currentStep,
          movement.from.y + stepY * currentStep,
        ),
      );
    }

    return path;
  }
}
