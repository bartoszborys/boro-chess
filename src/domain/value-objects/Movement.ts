import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";

export class Movement {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
    readonly capturing: boolean = false,
  ) { }

  calculateDelta(): Coordinates {
    return new Coordinates(this.to.x - this.from.x, this.to.y - this.from.y);
  }

  calculateDirection(): Direction {
    const deltaCoordinates = this.calculateDelta();
    const stepX = deltaCoordinates.x / Math.abs(deltaCoordinates.x) || 0;
    const stepY = deltaCoordinates.y / Math.abs(deltaCoordinates.y) || 0;
    return new Direction({ deltaX: stepX, deltaY: stepY });
  }
}
