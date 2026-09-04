import type { Coordinates, CoordinatesKey } from "@/core/domain/value-objects/Coordinates";
import type { DirectionMoveVector } from "@/core/domain/value-objects/Direction";
import type { Movement } from "@/core/domain/value-objects/Movement";

export type PathGenerationOptions = {
  movement: Movement;
  stepVector: DirectionMoveVector;
};

export type PathGenerationOptionsOnExistingFields = {
  from: Coordinates;
  direction: DirectionMoveVector & { maxRange: number };
  existingFields: CoordinatesKey[];
};

export interface PathGenerator {
  forVectorMovementWithoutTarget(options: PathGenerationOptions): Coordinates[];
  forDirectionOnExistingFields(options: PathGenerationOptionsOnExistingFields): Coordinates[];
}
