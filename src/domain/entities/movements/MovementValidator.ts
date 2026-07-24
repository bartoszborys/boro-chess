import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";

export interface MovementValidator {
  canMove(movement: Movement): boolean;
  getCollisionCoordinates(movement: Movement): Coordinates[];
}
