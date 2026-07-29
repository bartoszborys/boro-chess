import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "@/domain/entities/movements/MovementValidator";
import { FigureInvalidMove } from "../exceptions";
import { Direction } from "@/domain/value-objects/Direction";

export interface Figure {
  getCoordinates(): Coordinates;
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

  getCoordinates(): Coordinates {
    return new Coordinates(this.coordinates.x, this.coordinates.y);
  }

  getDirectionTo(to: Coordinates): Direction | null {
    const directions = this.movementValidator.getDirections();

    if (directions.length === 0) {
      return null;
    }

    const movement = new Movement(this.coordinates, to);
    const movementDirection = movement.calculateDirection();

    return directions.find(direction => direction.equals(movementDirection)) ?? null;
  }

  moveTo(to: Coordinates, capturing: boolean = false): boolean {
    const canMove = this.movementValidator.canMove(
      new Movement(this.coordinates, to, capturing),
    );

    if (!canMove) {
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
