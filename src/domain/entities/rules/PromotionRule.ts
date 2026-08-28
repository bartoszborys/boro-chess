import { FigureColor, FigureName } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { BoardSettings } from "@/domain/BoardSettings";

export interface PromotionRule {
    isPromotable(figureName: FigureName, color: FigureColor, coordinate: Coordinates): boolean;
}

export class ChessPromotionRule implements PromotionRule {
    public constructor(private readonly boardSettings: BoardSettings) { }

    public isPromotable(figureName: FigureName, color: FigureColor, coordinate: Coordinates): boolean {
        if (figureName !== FigureName.PAWN) {
            return false;
        }

        return this.boardSettings.onLastRank(coordinate, color);
    }
}
