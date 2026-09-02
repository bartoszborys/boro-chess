import type { DirectionMoveVector } from "./Direction";

export type CoordinatesKey = `${number}-${number}`;

export class Coordinates {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  public static fromKey(key: CoordinatesKey): Coordinates {
    const [x, y] = key.split("-");
    return new Coordinates(Number(x), Number(y));
  }

  public toKey(): CoordinatesKey {
    return `${this.x}-${this.y}`;
  }

  public add(x: number = 0, y: number = 0): Coordinates {
    return new Coordinates(this.x + x, this.y + y);
  }

  public addVector(vector: DirectionMoveVector): Coordinates {
    return new Coordinates(this.x + vector.deltaX, this.y + vector.deltaY);
  }

  public subtractVector(vector: DirectionMoveVector): Coordinates {
    return new Coordinates(this.x - vector.deltaX, this.y - vector.deltaY);
  }

  clone(): Coordinates {
    return new Coordinates(this.x, this.y);
  }

  equals(other: Coordinates): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `Coordinates(${this.x}, ${this.y})`;
  }
}
