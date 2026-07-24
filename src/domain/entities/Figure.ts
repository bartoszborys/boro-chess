import {
  Coordinates,
  MovementValidator,
} from "./movements/MovementValidator";

export type { Coordinates, MovementValidator };

export class Figure {
  private coordinates: Coordinates;
  private readonly movementValidator: MovementValidator;

  constructor(x: number, y: number, movementValidator: MovementValidator) {
    this.coordinates = { x, y };
    this.movementValidator = movementValidator;
  }

  getCoordinates(): Coordinates {
    return { ...this.coordinates };
  }

  move(x: number, y: number): void {
    this.coordinates = { x, y };
  }

  canMoveTo(x: number, y: number): boolean {
    return this.movementValidator.canMove(this.coordinates, { x, y });
  }
}
