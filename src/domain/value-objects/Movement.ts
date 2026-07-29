import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "./Direction";

export class Movement {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
    readonly capturing: boolean = false,
  ) { }

  calculateDelta(): Coordinates {
    return new Coordinates(this.to.x - this.from.x, this.to.y - this.from.y);
  }

  calculateStepsFor(direction: Direction): number {
    const delta = this.calculateDelta();
    return delta.x !== 0
      ? delta.x / direction.deltaX
      : delta.y / direction.deltaY;
  }
}
