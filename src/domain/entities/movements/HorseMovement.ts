import { Direction } from "@/domain/value-objects/Direction";
import type { MovementValidator } from "./MovementValidator";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";

export class HorseMovement implements MovementValidator {
  getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addCustomDirection(2, 1, { maxRange: 1 })
      .addCustomDirection(2, -1, { maxRange: 1 })
      .addCustomDirection(-2, 1, { maxRange: 1 })
      .addCustomDirection(-2, -1, { maxRange: 1 })
      .addCustomDirection(1, 2, { maxRange: 1 })
      .addCustomDirection(1, -2, { maxRange: 1 })
      .addCustomDirection(-1, 2, { maxRange: 1 })
      .addCustomDirection(-1, -2, { maxRange: 1 })
      .build();
  }
}
