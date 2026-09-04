import { FigureColor, FigureName } from "@/domain/enums";
import { Direction } from "@/domain/value-objects/Direction";
import type { ChessCheckRule } from "./CheckRule";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";

export class ByBehaviorCheckRule implements ChessCheckRule {
  constructor(
    private readonly figureNames: FigureName[],
    private readonly figureBehavior: FigureBehavior,
    private readonly color?: FigureColor,
  ) {}

  isCheck(figureName: FigureName): boolean {
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
