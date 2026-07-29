import { Figure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface Board {
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    hasFigureMoveCollision(figure: Figure, to: Coordinates): boolean;
}

export class CheesBoard implements Board {
    constructor(private readonly figures: Figure[]) { }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | undefined {
        return this.figures.find(figure => figure.isOn(coordinates));
    }

    public hasFigureMoveCollision(figure: Figure, to: Coordinates): boolean {
        const capturing = !!this.getFigureByCoordinates(to);

        for (const coordinate of figure.getThroughCoordinates(to, capturing)) {
            const figure = this.getFigureByCoordinates(coordinate);

            if (figure !== undefined) {
                return true;
            }
        }
        return false;
    }
}
