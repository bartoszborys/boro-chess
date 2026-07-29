import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
import type { MovementValidator } from "./MovementValidator";
import { Direction } from "@/domain/value-objects/Direction";

export class TowerMovement implements MovementValidator {
  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addLeftDirection()
      .addRightDirection()
      .addTopDirection()
      .addBottomDirection()
      .build();
  }
}
