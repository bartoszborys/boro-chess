import { Figure } from "@/domain/entities/Figure";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface Board {
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    hasFigureMoveCollision(figure: Figure, to: Coordinates): boolean;
}

export class ChessBoard implements Board {
    constructor(private readonly figures: Figure[]) { }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | undefined {
        return this.figures.find(figure => figure.getCoordinates().equals(coordinates));
    }

    public hasFigureMoveCollision(figure: Figure, to: Coordinates): boolean {
        const throughCoordinates = figure.getThroughCoordinates(to);

        for (const coordinate of throughCoordinates) {
            const figure = this.getFigureByCoordinates(coordinate);

            if (figure !== undefined) {
                return true;
            }
        }
        return false;
    }
}
