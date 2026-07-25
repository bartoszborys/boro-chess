import { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { FigureInvalidMove } from "@/domain/exceptions/FigureCannotMove";

export class BishopMovement implements MovementValidator {
  public canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    return delta.x !== 0 && Math.abs(delta.x) === Math.abs(delta.y);
  }

  public getCollisionCoordinates(movement: Movement): Coordinates[] {
    const movementDelta = movement.calculateDelta();
    const stepsCount = Math.abs(movementDelta.x);
    const stepXDeltaSign = Math.sign(movementDelta.x)
    const stepYDeltaSign = Math.sign(movementDelta.y);

    const path: Coordinates[] = [];

    for (let currentStep = 1; currentStep < stepsCount; currentStep++) {
      const x = movement.from.x + stepXDeltaSign * currentStep;
      const y = movement.from.y + stepYDeltaSign * currentStep;
      path.push(new Coordinates(x, y));
    }

    return path;
  }
}
