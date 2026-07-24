import type { Movement } from "@/domain/value-objects/Movement";

export interface MovementValidator {
  canMove(movement: Movement): boolean;
}
