import { Figure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface Board {
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    hasFigureMoveCollision(figure: Figure, to: Coordinates): boolean;
}

export class CheesBoard implements Board {
    constructor(private readonly figures: Figure[]) { }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | undefined {
        return this.figures.find(figure => figure.getCoordinates().equals(coordinates));
    }

    public hasFigureMoveCollision(figure: Figure, to: Coordinates): boolean {
        for (const coordinate of figure.getThroughCoordinates(to)) {
            const figure = this.getFigureByCoordinates(coordinate);

            if (figure !== undefined) {
                return true;
            }
        }
        return false;
    }
}
