import type { Figure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { FigureDetails } from "@/domain/value-objects/CapturedFigure";
import { FigureInvalidMove, FigureNotFound } from "../exceptions";
import { Movement } from "../value-objects/Movement";
import { BoardStateFigure } from "../value-objects/BoardStateFigure";

export interface BoardState {
    getState(): BoardStateFigure[];
}

export interface Board {
    getBaseCoordinates(): Coordinates;
    moveFigure(movement: Movement): void;
    getFigureByCoordinates(coordinates: Coordinates): Figure | undefined;
    getFigureByCoordinatesOrThrow(coordinates: Coordinates): Figure;
    anyFigureOnCoordinates(path: Coordinates[]): boolean;
    captureFigureByCoordinates(coordinates: Coordinates): void;
    reset(figures: Figure[], capturedFigures?: FigureDetails[]): void;
}

export class CheesBoard implements Board, BoardState {
    private readonly boardSize: number = 8;

    constructor(
        private figures: Figure[],
        private capturedFigures: FigureDetails[],
    ) { }

    public getBaseCoordinates(): Coordinates {
        return new Coordinates(1, 1);
    }

    public getState(): BoardStateFigure[] {
        return this.figures.map(figure => ({
            ...figure.figureDetails(),
            coordinates: figure.getCoordinates(),
            isCaptured: this.capturedFigures.find(
                item => item.name === figure.figureDetails().name && item.color === figure.figureDetails().color,
            ) !== undefined,
        }));
    }

    public moveFigure(movement: Movement): void {
        const figure = this.getFigureByCoordinatesOrThrow(movement.from);
        if (movement.to.x < 1) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        if (movement.to.x > this.boardSize) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        if (movement.to.y < 1) {
            throw new FigureInvalidMove("Movement is out of board");
        }
        if (movement.to.y > this.boardSize) {
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
        this.capturedFigures.push(figure.figureDetails());
        this.figures.splice(this.figures.indexOf(figure), 1);
    }

    public reset(figures: Figure[], capturedFigures: FigureDetails[] = []): void {
        this.figures = figures;
        this.capturedFigures = capturedFigures;
    }
}
