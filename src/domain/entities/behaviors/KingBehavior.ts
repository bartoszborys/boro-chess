import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import type { Direction } from "@/domain/value-objects/Direction";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { FigureName } from "@/domain/enums";

export class KingBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.KING;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addTopDirection({ maxRange: 1 })
      .addTopRightDirection({ maxRange: 1 })
      .addTopLeftDirection({ maxRange: 1 })
      .addBottomDirection({ maxRange: 1 })
      .addBottomRightDirection({ maxRange: 1 })
      .addBottomLeftDirection({ maxRange: 1 })
      .addLeftDirection({ maxRange: 1 })
      .addRightDirection({ maxRange: 1 })
      .addLeftDirection({ maxRange: 3, minRange: 3, whenStartingPosition: true, castling: true })
      .addRightDirection({ maxRange: 2, minRange: 2, whenStartingPosition: true, castling: true })
      .build();
  }
}
