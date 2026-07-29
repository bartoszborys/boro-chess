import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "./MovementValidator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";

export abstract class PawnMovement implements MovementValidator {
  constructor(
    private readonly startingPosition: Coordinates,
    private readonly oneStep: number,
    private readonly twoSteps: number,
  ) { }

  canMove(movement: Movement): boolean {
    const delta = movement.calculateDelta();

    if (!movement.capturing && delta.x !== 0) {
      return false;
    }

    if (movement.capturing && (Math.abs(delta.x) !== 1 || delta.y !== this.oneStep)) {
      return false;
    }

    if (delta.y === this.oneStep) {
      return true;
    }

    if (delta.y === this.twoSteps) {
      return movement.from.equals(this.startingPosition);
    }

    return false;
  }

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
