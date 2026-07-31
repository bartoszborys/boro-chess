import type { MovementValidator } from "@/domain/movements/MovementValidator";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";

export interface Figure {
  isOn(coordinates: Coordinates): boolean;
  getDirections(): Direction[];
  hasMoved(): boolean;
  moveTo(to: Coordinates): void;
}

export class CheesFigure implements Figure {
  private _hasMoved: boolean = false;
  private coordinates: Coordinates;
  private readonly movementValidator: MovementValidator;

  constructor(coordinates: Coordinates, movementValidator: MovementValidator) {
    this.coordinates = coordinates;
    this.movementValidator = movementValidator;
  }

  public isOn(coordinates: Coordinates): boolean {
    return this.coordinates.equals(coordinates);
  }

  public moveTo(to: Coordinates): void {
    this._hasMoved = true;
    this.coordinates = to;
  }

  public getDirections(): Direction[] {
    return this.movementValidator.getDirections();
  }

  public hasMoved(): boolean {
    return this._hasMoved;
  }
}
