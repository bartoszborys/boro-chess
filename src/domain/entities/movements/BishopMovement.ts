import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
import { Direction } from "@/domain/value-objects/Direction";

export class BishopMovement implements MovementValidator {
  public getThroughCoordinates(movement: Movement): Coordinates[] {
    const movementDelta = movement.calculateDelta();
    const stepsCount = Math.abs(movementDelta.x);
    const stepXDeltaSign = Math.sign(movementDelta.x);
    const stepYDeltaSign = Math.sign(movementDelta.y);

    const path: Coordinates[] = [];

    for (let currentStep = 1; currentStep < stepsCount; currentStep++) {
      const x = movement.from.x + stepXDeltaSign * currentStep;
      const y = movement.from.y + stepYDeltaSign * currentStep;
      path.push(new Coordinates(x, y));
    }

    return path;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopRightDirection()
      .addTopLeftDirection()
      .addBottomRightDirection()
      .addBottomLeftDirection()
      .build();
  }
}
