import { Coordinates } from "@/domain/entities/Coordinates";
import { Movement } from "@/domain/entities/Movement";
import type { MovementValidator } from "@/domain/entities/movements/MovementValidator";

export { Coordinates, Movement };
export type { MovementValidator };

export class Figure {
  private coordinates: Coordinates;
  private readonly movementValidator: MovementValidator;

  constructor(x: number, y: number, movementValidator: MovementValidator) {
    this.coordinates = new Coordinates(x, y);
    this.movementValidator = movementValidator;
  }

  getCoordinates(): Coordinates {
    return new Coordinates(this.coordinates.x, this.coordinates.y);
  }

  move(x: number, y: number): void {
    this.coordinates = new Coordinates(x, y);
  }

  canMoveTo(x: number, y: number): boolean {
    return this.movementValidator.canMove(
      new Movement(this.coordinates, new Coordinates(x, y)),
    );
  }
}
