import { Coordinates } from "@/domain/entities/Coordinates";

export class Movement {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
    readonly capturing: boolean = false,
  ) {}

  calculateDelta(): Coordinates {
    return new Coordinates(this.to.x - this.from.x, this.to.y - this.from.y);
  }
}
