import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "@/domain/entities/movements/MovementValidator";
import { FigureInvalidMove } from "../exceptions";
import { Direction } from "@/domain/value-objects/Direction";

export interface Figure {
  isOn(coordinates: Coordinates): boolean;
  getDirectionTo(to: Coordinates): Direction | null;
  moveTo(to: Coordinates, capturing?: boolean): boolean;
  getThroughCoordinates(to: Coordinates, capturing?: boolean): Coordinates[];
}

export class CheesFigure implements Figure {
  private coordinates: Coordinates;
  private readonly movementValidator: MovementValidator;

  constructor(coordinates: Coordinates, movementValidator: MovementValidator) {
    this.coordinates = coordinates;
    this.movementValidator = movementValidator;
  }

  isOn(coordinates: Coordinates): boolean {
    return this.coordinates.equals(coordinates);
  }

  getDirectionTo(to: Coordinates, capturing: boolean = false): Direction | null {
    const directions = this.movementValidator.getDirections();

    if (directions.length === 0) {
      return null;
    }

    const movement = new Movement(this.coordinates, to, capturing);

    return directions.find(direction => direction.matchesMovement(movement)) ?? null;
  }

  moveTo(to: Coordinates, capturing: boolean = false): boolean {
    const direction = this.getDirectionTo(to, capturing);

    if (!direction) {
      return false;
    }

    this.coordinates = to;
    return true;
  }

  getThroughCoordinates(to: Coordinates, capturing: boolean = false): Coordinates[] {
    const movement = new Movement(this.coordinates, to, capturing);

    if (!this.movementValidator.canMove(movement)) {
      throw new FigureInvalidMove(`Figure cannot move from ${this.coordinates} to ${to}`);
    }

    return this.movementValidator.getThroughCoordinates(movement);
  }
}
