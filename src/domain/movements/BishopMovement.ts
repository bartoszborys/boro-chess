import type { MovementValidator } from "@/domain/movements/MovementValidator";
import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import { Direction } from "@/domain/value-objects/Direction";

export class BishopMovement implements MovementValidator {
  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopRightDirection()
      .addTopLeftDirection()
      .addBottomRightDirection()
      .addBottomLeftDirection()
      .build();
  }
}
