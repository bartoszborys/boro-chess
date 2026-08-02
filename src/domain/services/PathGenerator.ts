import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { DirectionMoveVector } from "@/domain/value-objects/Direction";
import type { Movement } from "@/domain/value-objects/Movement";

export type PathGenerationOptions = {
  movement: Movement;
  stepVector: DirectionMoveVector;
};

export interface PathGenerator {
  forConcreteMovement(options: PathGenerationOptions): Coordinates[];
}

export class CheesPathGenerator implements PathGenerator {
  public forConcreteMovement({ movement, stepVector }: PathGenerationOptions): Coordinates[] {
    const { from, to } = movement;
    const steps = this.calculateStepsFor(from, to, stepVector);
    const path: Coordinates[] = [];

    for (let step = 1; step < steps; step++) {
      path.push(
        new Coordinates(
          from.x + stepVector.deltaX * step,
          from.y + stepVector.deltaY * step,
        ),
      );
    }

    return path;
  }

  private calculateStepsFor(
    from: Coordinates,
    to: Coordinates,
    stepVector: DirectionMoveVector,
  ): number {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    return deltaX !== 0
      ? deltaX / stepVector.deltaX
      : deltaY / stepVector.deltaY;
  }
}
