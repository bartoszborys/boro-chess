import type { MovementValidator } from "./MovementValidator";
import { DirectionsBuilder } from "@/domain/DirectionsBuilder";
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
