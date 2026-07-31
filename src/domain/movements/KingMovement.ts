import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import type { Direction } from "@/domain/value-objects/Direction";
import type { MovementValidator } from "@/domain/movements/MovementValidator";

export class KingMovement implements MovementValidator {
  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopDirection({ maxRange: 1 })
      .addTopRightDirection({ maxRange: 1 })
      .addTopLeftDirection({ maxRange: 1 })
      .addBottomDirection({ maxRange: 1 })
      .addBottomRightDirection({ maxRange: 1 })
      .addBottomLeftDirection({ maxRange: 1 })
      .addLeftDirection({ maxRange: 1 })
      .addRightDirection({ maxRange: 1 })
      .build();
  }
}
