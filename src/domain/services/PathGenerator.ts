import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { DirectionMoveVector } from "@/domain/value-objects/Direction";
import type { Movement } from "@/domain/value-objects/Movement";

export type PathGenerationOptions = {
  movement: Movement;
  vector: DirectionMoveVector;
};

export interface PathGenerator {
  fromConcretePath(options: PathGenerationOptions): Coordinates[];
}

export class CheesPathGenerator implements PathGenerator {
  public fromConcretePath({ movement, vector }: PathGenerationOptions): Coordinates[] {
    const { from, to } = movement;
    const steps = this.calculateStepsFor(from, to, vector);
    const path: Coordinates[] = [];

    for (let step = 1; step < steps; step++) {
      path.push(
        new Coordinates(
          from.x + vector.deltaX * step,
          from.y + vector.deltaY * step,
        ),
      );
    }

    return path;
  }

  private calculateStepsFor(
    from: Coordinates,
    to: Coordinates,
    vector: DirectionMoveVector,
  ): number {
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    return deltaX !== 0
      ? deltaX / vector.deltaX
      : deltaY / vector.deltaY;
  }
}
