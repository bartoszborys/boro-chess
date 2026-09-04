import { FigureColor, FigureName } from "@/core/domain/enums";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";
import type { BoardSettings } from "@/core/domain/services/BoardSettings";
import type { PromotionRule } from "@/core/domain/entities/rules/PromotionRule";

export class ChessPromotionRule implements PromotionRule {
  public constructor(private readonly boardSettings: BoardSettings) {}

  public isPromotable(figureName: FigureName, color: FigureColor, coordinate: Coordinates): boolean {
    if (figureName !== FigureName.PAWN) {
      return false;
    }

    return this.onLastRank(coordinate, color);
  }

  private onLastRank({ y }: Coordinates, color: FigureColor): boolean {
    const [, ySize] = this.boardSettings.getBoardSize();

    if (color === FigureColor.WHITE) {
      return y === ySize;
    }

    return y === 1;
  }
}
