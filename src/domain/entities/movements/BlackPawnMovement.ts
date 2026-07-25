import { Coordinates } from "@/domain/value-objects/Coordinates";
import { PawnMovement } from "./PawnMovement";

export class BlackPawnMovement extends PawnMovement {
  constructor(startingPosition: Coordinates) {
    const oneStep = -1;
    const twoSteps = -2;
    super(startingPosition, oneStep, twoSteps);
  }
}
