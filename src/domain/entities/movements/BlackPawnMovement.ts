import { PawnMovement } from "./PawnMovement";
import { Direction } from "@/domain/value-objects/Direction";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";

export class BlackPawnMovement extends PawnMovement {
  constructor() {
    const oneStep = -1;
    const twoSteps = -2;
    super(oneStep, twoSteps);
  }

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
