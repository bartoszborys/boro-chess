import { Direction } from "@/domain/value-objects/Direction";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";
import { FigureName } from "@/domain/enums";

export class HorseBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.HORSE;
  }

  public getDirections(): Direction[] {
    return DirectionsBuilder.create()
      .addCustomDirection(2, 1, { maxRange: 1 })
      .addCustomDirection(2, -1, { maxRange: 1 })
      .addCustomDirection(-2, 1, { maxRange: 1 })
      .addCustomDirection(-2, -1, { maxRange: 1 })
      .addCustomDirection(1, 2, { maxRange: 1 })
      .addCustomDirection(1, -2, { maxRange: 1 })
      .addCustomDirection(-1, 2, { maxRange: 1 })
      .addCustomDirection(-1, -2, { maxRange: 1 })
      .build();
  }
}
