import type { MovementValidator } from "@/domain/movements/MovementValidator";
import { TowerMovement } from "@/domain/movements/TowerMovement";
import { BishopMovement } from "@/domain/movements/BishopMovement";
import { Direction } from "@/domain/value-objects/Direction";

export class QueenMovement implements MovementValidator {
  private readonly bishopMovement = new BishopMovement();
  private readonly towerMovement = new TowerMovement();

  getDirections(): Direction[] {
    return [
      ...this.towerMovement.getDirections(),
      ...this.bishopMovement.getDirections(),
    ];
  }
}
