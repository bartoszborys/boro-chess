import type { MovementValidator } from "./MovementValidator";
import { TowerMovement } from "./TowerMovement";
import { BishopMovement } from "./BishopMovement";
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
