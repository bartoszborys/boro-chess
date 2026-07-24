export class Coordinates {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  equals(other: Coordinates): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `Coordinates(${this.x}, ${this.y})`;
  }
}
