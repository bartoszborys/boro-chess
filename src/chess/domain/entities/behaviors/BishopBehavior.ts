import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { DirectionsBuilder } from "@/chess/domain/builders/DirectionsBuilder";
import { Direction } from "@/core/domain/value-objects/Direction";
import { FigureName } from "@/core/domain/enums";

export class BishopBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.BISHOP;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopRightDirection()
      .addTopLeftDirection()
      .addBottomRightDirection()
      .addBottomLeftDirection()
      .build();
  }
}
