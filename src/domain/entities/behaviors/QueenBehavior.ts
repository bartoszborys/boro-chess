import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { TowerBehavior } from "@/domain/entities/behaviors/TowerBehavior";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { Direction } from "@/domain/value-objects/Direction";
import { FigureName } from "@/domain/enums";

export class QueenBehavior implements FigureBehavior {
  private readonly bishopBehavior = new BishopBehavior();
  private readonly towerBehavior = new TowerBehavior();

  public getName(): FigureName {
    return FigureName.QUEEN;
  }

  public getDirections(): Direction[] {
    return [
      ...this.towerBehavior.getDirections(),
      ...this.bishopBehavior.getDirections(),
    ];
  }
}
