import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import { Direction } from "@/domain/value-objects/Direction";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { FigureName } from "@/domain/enums";

export class WhitePawnBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.PAWN;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopDirection({
        canCapture: false,
        maxRange: 1,
      })
      .addTopDirection({
        canCapture: false,
        whenStartingPosition: true,
        maxRange: 2,
      })
      .addTopRightDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .addTopLeftDirection({
        canCapture: true,
        whenEnemy: true,
        maxRange: 1,
      })
      .build();
  }
}
