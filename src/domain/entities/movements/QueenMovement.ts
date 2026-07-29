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

  getDirections(): Direction[] {
    return [
      ...this.towerMovement.getDirections(),
      ...this.bishopMovement.getDirections(),
    ];
  }

  getThroughCoordinates(movement: Movement): Coordinates[] {
    const matchesBishop = this.bishopMovement
      .getDirections()
      .some((direction) => direction.matchesMovement(movement));

    if (matchesBishop) {
      return this.bishopMovement.getThroughCoordinates(movement);
    }

    const matchesTower = this.towerMovement
      .getDirections()
      .some((direction) => direction.matchesMovement(movement));

    if (matchesTower) {
      return this.towerMovement.getThroughCoordinates(movement);
    }

    throw new FigureInvalidMove(
      `Figure cannot move from ${movement.from} to ${movement.to}`,
    );
  }
}
