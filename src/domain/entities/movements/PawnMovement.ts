import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";

export abstract class PawnMovement implements MovementValidator {
  constructor(
    _startingPosition: Coordinates,
    private readonly oneStep: number,
    private readonly twoSteps: number,
  ) { }

  abstract getDirections(): Direction[];

  getThroughCoordinates(movement: Movement): Coordinates[] {
    const delta = movement.calculateDelta();

    if (Math.abs(delta.y) > Math.abs(this.twoSteps)) {
      throw new FigureInvalidMove(`Figure cannot move from ${movement.from} to ${movement.to}`);
    }

    if (delta.y === this.twoSteps) {
      return [
        new Coordinates(movement.from.x, movement.from.y + this.oneStep),
      ];
    }

    return [];
  }
}
