import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "./Direction";

export class Movement {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
    readonly capturing: boolean = false,
  ) { }

  public calculateDelta(): Coordinates {
    return new Coordinates(this.to.x - this.from.x, this.to.y - this.from.y);
  }

  public calculateThroughCoordinates(direction: Direction): Coordinates[] {
    const steps = this.calculateStepsFor(direction);
    const path: Coordinates[] = [];

    for (let step = 1; step < steps; step++) {
      path.push(
        new Coordinates(
          this.from.x + direction.deltaX * step,
          this.from.y + direction.deltaY * step,
        ),
      );
    }

    return path;
  }

  private calculateStepsFor(direction: Direction): number {
    const delta = this.calculateDelta();
    return delta.x !== 0
      ? delta.x / direction.deltaX
      : delta.y / direction.deltaY;
  }

}
