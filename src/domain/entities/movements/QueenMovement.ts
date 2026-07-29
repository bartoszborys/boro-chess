import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { TowerMovement } from "./TowerMovement";
import { BishopMovement } from "./BishopMovement";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";

export class QueenMovement implements MovementValidator {
  private readonly bishopMovement = new BishopMovement();
  private readonly towerMovement = new TowerMovement();

  canMove(movement: Movement): boolean {
    return (
      this.bishopMovement.canMove(movement) ||
      this.towerMovement.canMove(movement)
    );
  }

  getDirections(): Direction[] {
    return [
      ...this.towerMovement.getDirections(),
      ...this.bishopMovement.getDirections(),
    ]
  }

  getThroughCoordinates(movement: Movement): Coordinates[] {
    if (this.bishopMovement.canMove(movement)) {
      return this.bishopMovement.getThroughCoordinates(movement);
    }

    if (this.towerMovement.canMove(movement)) {
      return this.towerMovement.getThroughCoordinates(movement);
    }

    throw new FigureInvalidMove(`Figure cannot move from ${movement.from} to ${movement.to}`);
  }
}
