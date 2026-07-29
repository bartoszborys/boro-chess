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

  public isOn(coordinates: Coordinates): boolean {
    return this.coordinates.equals(coordinates);
  }

  public getDirectionTo(to: Coordinates, capturing: boolean = false): Direction | null {
    const directions = this.movementValidator.getDirections();

    if (directions.length === 0) {
      return null;
    }

    const movement = new Movement(this.coordinates, to, capturing);

    return directions.find(direction => direction.matchesMovement(movement)) ?? null;
  }

  public moveTo(to: Coordinates, capturing: boolean = false): boolean {
    if (!this.canMove(to, capturing)) {
      return false;
    }

    this.coordinates = to;
    return true;
  }

  public getThroughCoordinates(
    to: Coordinates,
    capturing: boolean = false,
  ): Coordinates[] {
    const direction = this.getDirectionTo(to, capturing);

    if (!direction) {
      throw new FigureInvalidMove(
        `Figure cannot move from ${this.coordinates} to ${to}`,
      );
    }

    const movement = new Movement(this.coordinates, to, capturing);
    const steps = movement.calculateStepsFor(direction);

    const path: Coordinates[] = [];

    for (let step = 1; step < steps; step++) {
      const stepX = this.coordinates.x + direction.deltaX * step;
      const stepY = this.coordinates.y + direction.deltaY * step;

      path.push(new Coordinates(stepX, stepY));
    }

    return path;
  }

  private canMove(to: Coordinates, capturing: boolean = false): boolean {
    return !!this.getDirectionTo(to, capturing);
  }
}
