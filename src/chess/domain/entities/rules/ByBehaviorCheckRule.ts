import { FigureColor, FigureName } from "@/core/domain/enums";
import { Direction } from "@/core/domain/value-objects/Direction";
import type { ChessCheckRule } from "@/chess/domain/entities/rules/CheckRule";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";

export class ByBehaviorCheckRule implements ChessCheckRule {
  constructor(
    private readonly figureNames: FigureName[],
    private readonly figureBehavior: FigureBehavior,
    private readonly color?: FigureColor,
  ) {}

  handlesFigure(figureName: FigureName): boolean {
    return this.figureNames.includes(figureName);
  }

  getDirections(): Direction[] {
    return this.figureBehavior.getDirections();
  }

  canApplyToColor(color: FigureColor): boolean {
    if (this.color === undefined) {
      return true;
    }

    return this.color === color;
  }
}
