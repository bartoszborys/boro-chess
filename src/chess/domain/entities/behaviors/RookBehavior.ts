import { DirectionsBuilder } from "@/chess/domain/builders/DirectionsBuilder";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { Direction } from "@/core/domain/value-objects/Direction";
import { FigureName } from "@/core/domain/enums";

export class RookBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.ROOK;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addLeftDirection()
      .addRightDirection()
      .addTopDirection()
      .addBottomDirection()
      .build();
  }
}
