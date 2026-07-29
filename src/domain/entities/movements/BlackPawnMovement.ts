import { Direction } from "@/domain/value-objects/Direction";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
import type { MovementValidator } from "./MovementValidator";

export class BlackPawnMovement implements MovementValidator {
  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addBottomDirection({
        canCapture: false,
        whenEnemy: false,
        maxRange: 1,
      })
      .addBottomDirection({
        canCapture: false,
        whenEnemy: false,
        maxRange: 2,
        whenStartingPosition: true,
      })
      .addBottomRightDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .addBottomLeftDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .build();
  }
}
