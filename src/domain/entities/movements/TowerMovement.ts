import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";

export class TowerMovement implements MovementValidator {
  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    return (delta.x !== 0 && delta.y === 0) || (delta.y !== 0 && delta.x === 0);
  }

  getCollisionCoordinates(movement: Movement): Coordinates[] {
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
