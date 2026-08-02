import { Direction } from "@/domain/value-objects/Direction";
import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { FigureName } from "@/domain/enums";

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
