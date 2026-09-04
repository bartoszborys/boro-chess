import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { RookBehavior } from "@/chess/domain/entities/behaviors/RookBehavior";
import { BishopBehavior } from "@/chess/domain/entities/behaviors/BishopBehavior";
import { Direction } from "@/core/domain/value-objects/Direction";
import { FigureName } from "@/core/domain/enums";

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
