import type { Figure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface Board {
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    anyFigureOnCoordinates(path: Coordinates[]): boolean;
}

export class CheesBoard implements Board {
    constructor(private readonly figures: Figure[]) { }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | undefined {
        return this.figures.find(figure => figure.isOn(coordinates));
    }

    public anyFigureOnCoordinates(coordinates: Coordinates[]): boolean {
        for (const coordinate of coordinates) {
            const blockingFigure = this.getFigureByCoordinates(coordinate);

            if (blockingFigure !== undefined) {
                return true;
            }
        }
        return false;
    }
}
