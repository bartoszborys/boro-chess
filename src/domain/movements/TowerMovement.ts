import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import type { MovementValidator } from "@/domain/movements/MovementValidator";
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
