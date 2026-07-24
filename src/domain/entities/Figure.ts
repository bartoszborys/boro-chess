import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import type { MovementValidator } from "@/domain/entities/movements/MovementValidator";

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

  getCollisionCoordinatess(to: Coordinates, capturing: boolean = false): Coordinates[] {
    return this.movementValidator.getCollisionCoordinates(
      new Movement(this.coordinates, to, capturing),
    );
  }
}
