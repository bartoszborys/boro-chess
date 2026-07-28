import type { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface MovementValidator {
  canMove(movement: Movement): boolean;
  getDirections(): Direction[];
  getCollisionCoordinates(movement: Movement): Coordinates[];
}
