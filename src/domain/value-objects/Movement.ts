import { Coordinates } from "@/domain/value-objects/Coordinates";

export class Movement {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
    readonly capturing: boolean = false,
  ) { }

  calculateDelta(): Coordinates {
    return new Coordinates(this.to.x - this.from.x, this.to.y - this.from.y);
  }

  sameX(): boolean {
    return this.from.x === this.to.x;
  }

  sameY(): boolean {
    return this.from.y === this.to.y;
  }
}
