import { DirectionMoveVector } from "./Direction";

export class Coordinates {
  constructor(
    readonly x: number,
    readonly y: number,
  ) { }

  public addVector(vector: DirectionMoveVector): Coordinates {
    return new Coordinates(
      this.x + vector.deltaX,
      this.y + vector.deltaY,
    );
  }

  public subtractVector(vector: DirectionMoveVector): Coordinates {
    return new Coordinates(
      this.x - vector.deltaX,
      this.y - vector.deltaY,
    );
  }

  equals(other: Coordinates): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `Coordinates(${this.x}, ${this.y})`;
  }
}
