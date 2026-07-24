import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { TowerMovement } from "./TowerMovement";
import { BishopMovement } from "./BishopMovement";

export class QueenMovement implements MovementValidator {
  private readonly bishopMovement = new BishopMovement();
  private readonly towerMovement = new TowerMovement();

  canMove(movement: Movement): boolean {
    return this.bishopMovement.canMove(movement) || this.towerMovement.canMove(movement);
  }
}
