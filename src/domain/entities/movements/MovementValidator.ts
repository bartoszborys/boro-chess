import type { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface MovementValidator {
  getDirections(): Direction[];
  getThroughCoordinates(movement: Movement): Coordinates[];
}
