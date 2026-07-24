import type { Movement } from "@/domain/entities/Movement";

export interface MovementValidator {
  canMove(movement: Movement): boolean;
}
