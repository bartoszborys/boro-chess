import { PawnMovement } from "./PawnMovement";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
import { Direction } from "@/domain/value-objects/Direction";

export class WhitePawnMovement extends PawnMovement {
  constructor() {
    const oneStep = 1;
    const twoSteps = 2;
    super(oneStep, twoSteps);
  }

  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopDirection({
        canCapture: false,
        maxRange: 1,
      })
      .addTopDirection({
        canCapture: false,
        whenStartingPosition: true,
        maxRange: 2,
      })
      .addTopRightDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .addTopLeftDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .build();
  }
}