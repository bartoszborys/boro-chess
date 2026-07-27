import { Figure } from "@/domain/entities/Figure";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface Board {
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    canFigureMoveTo(figure: Figure, to: Coordinates): boolean;
}

export class ChessBoard implements Board {
    constructor(public readonly figures: Figure[]) { }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | undefined {
        return this.figures.find(figure => figure.getCoordinates().equals(coordinates));
    }

    canFigureMoveTo(figure: Figure, to: Coordinates): boolean {
        return false;
    }
}
