import { Direction } from "@/core/domain/value-objects/Direction";
import { DirectionsBuilder } from "@/chess/domain/builders/DirectionsBuilder";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { FigureName } from "@/core/domain/enums";

export class BlackPawnBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.PAWN;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addBottomDirection({
        canCapture: false,
        whenEnemy: false,
        maxRange: 1,
      })
      .addBottomDirection({
        canCapture: false,
        whenEnemy: false,
        maxRange: 2,
        whenStartingPosition: true,
      })
      .addBottomRightDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .addBottomLeftDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .build();
  }
}
