import type { Figure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { CapturedFigure } from "@/domain/value-objects/CapturedFigure";
import { FigureInvalidMove, FigureNotFound } from "../exceptions";
import { Movement } from "../value-objects/Movement";

export interface Board {
    moveFigure(movement: Movement): void;
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    getFigureByCoordinatesOrThrow(coordinates: Coordinates): Figure;
    anyFigureOnCoordinates(path: Coordinates[]): boolean;
    captureFigureByCoordinates(coordinates: Coordinates): void;
}

export class CheesBoard implements Board {
    private readonly boardSize: number = 8;

    constructor(
        private readonly figures: Figure[],
        private readonly capturedFigures: CapturedFigure[],
    ) { }

    public moveFigure(movement: Movement): void {
        const figure = this.getFigureByCoordinatesOrThrow(movement.from);
        if (movement.to.x < 0) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        if (movement.to.x >= this.boardSize) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        if (movement.to.y < 0) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        if (movement.to.y >= this.boardSize) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        figure.moveTo(movement.to);
    }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | undefined {
        return this.figures.find(figure => figure.isOn(coordinates));
    }

    public getFigureByCoordinatesOrThrow(coordinates: Coordinates): Figure {
        const figure = this.getFigureByCoordinates(coordinates);
        if (!figure) {
            throw new FigureNotFound();
        }
        return figure;
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

    public captureFigureByCoordinates(coordinates: Coordinates): void {
        const figure = this.getFigureByCoordinatesOrThrow(coordinates);
        this.capturedFigures.push(figure.capturedDetails());
        this.figures.splice(this.figures.indexOf(figure), 1);
    }
}
