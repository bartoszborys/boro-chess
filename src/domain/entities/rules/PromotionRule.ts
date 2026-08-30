import { FigureColor, FigureName } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { BoardSettings } from "@/domain/services/BoardSettings";

export interface PromotionRule {
  isPromotable(figureName: FigureName, color: FigureColor, coordinate: Coordinates): boolean;
}

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
