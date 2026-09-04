import { Coordinates, type CoordinatesKey } from "@/core/domain/value-objects/Coordinates";
import type { DirectionMoveVector } from "@/core/domain/value-objects/Direction";
import type { Movement } from "@/core/domain/value-objects/Movement";
import type {
  PathGenerationOptions,
  PathGenerationOptionsOnExistingFields,
  PathGenerator,
} from "@/core/domain/services/PathGenerator";

export class GridPathGenerator implements PathGenerator {
  public forVectorMovementWithoutTarget({ movement, stepVector }: PathGenerationOptions): Coordinates[] {
    const steps = this.calculateStepsFor(movement, stepVector);
    const path: Coordinates[] = [];

    for (let step = 1; step < steps; step++) {
      path.push(
        new Coordinates(movement.from.x + stepVector.deltaX * step, movement.from.y + stepVector.deltaY * step),
      );
    }

    return path;
  }

  public forDirectionOnExistingFields({
    from,
    direction,
    existingFields,
  }: PathGenerationOptionsOnExistingFields): Coordinates[] {
    const existingFieldsSet = new Set(existingFields);
    const path: Coordinates[] = [];

    for (let step = 1; step <= direction.maxRange; step++) {
      const coordinate = new Coordinates(from.x + direction.deltaX * step, from.y + direction.deltaY * step);

      if (!existingFieldsSet.has(coordinate.toKey())) {
        break;
      }

      path.push(coordinate);
    }

    return path;
  }

  private calculateStepsFor(movement: Movement, stepVector: DirectionMoveVector): number {
    const deltaX = movement.to.x - movement.from.x;
    const deltaY = movement.to.y - movement.from.y;

    return deltaX !== 0 ? deltaX / stepVector.deltaX : deltaY / stepVector.deltaY;
  }
}
