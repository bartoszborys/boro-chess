import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import { Direction } from "@/domain/value-objects/Direction";
import { FigureName } from "@/domain/enums";

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
