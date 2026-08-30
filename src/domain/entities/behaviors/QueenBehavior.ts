import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { RookBehavior } from "@/domain/entities/behaviors/RookBehavior";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { Direction } from "@/domain/value-objects/Direction";
import { FigureName } from "@/domain/enums";

export class QueenBehavior implements FigureBehavior {
  private readonly bishopBehavior = new BishopBehavior();
  private readonly rookBehavior = new RookBehavior();

  public getName(): FigureName {
    return FigureName.QUEEN;
  }

  public getDirections(): Direction[] {
    return [...this.rookBehavior.getDirections(), ...this.bishopBehavior.getDirections()];
  }
}
