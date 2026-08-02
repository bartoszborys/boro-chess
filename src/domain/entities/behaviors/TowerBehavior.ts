import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { Direction } from "@/domain/value-objects/Direction";
import { FigureName } from "@/domain/enums";

export class TowerBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.TOWER;
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
