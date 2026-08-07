import type { Figure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { FigureDetails } from "@/domain/value-objects/CapturedFigure";
import { BoardFieldNotFound, FigureNotFound } from "@/domain/exceptions";
import { Movement } from "../value-objects/Movement";
import { BoardFigureState } from "../value-objects/BoardFigureState";
import { BoardFieldState } from "../value-objects/BoardFieldState";
import { BoardField } from "../value-objects/BoardField";
import { FigureColor } from "@/domain/enums";

export interface BoardState {
    getFiguresState(): BoardFigureState[];
}

export interface Board {
    moveFigure(movement: Movement): void;
    getFieldsState(playerColor: FigureColor): BoardFieldState[];
    getFigureByCoordinates(coordinates: Coordinates): Figure | null;
    getFigureByCoordinatesOrThrow(coordinates: Coordinates): Figure;
    anyFigureOnCoordinates(path: Coordinates[]): boolean;
    captureFigureByCoordinates(coordinates: Coordinates): void;
    addFigure(figure: Figure, coordinates: Coordinates): void;
}

export class FieldsBoard implements Board, BoardState {
    private capturedFigures: FigureDetails[] = [];

    constructor(
        private fields: Record<string, BoardField> = {},
    ) { }

    public getFiguresState(): BoardFigureState[] {
        const occupiedFields = Object.values(this.fields).filter(
            (field): field is BoardField & { figure: Figure } => field.figure !== null,
        );

        return occupiedFields.map(({ figure, coordinates }) => ({
            ...figure.figureDetails(),
            coordinates,
            isCaptured: this.capturedFigures.find(
                item => item.name === figure.figureDetails().name
                    && item.color === figure.figureDetails().color,
            ) !== undefined,
        }));
    }

    public getFieldsState(playerColor: FigureColor): BoardFieldState[] {
        const fieldValues = Object.values(this.fields);
        return fieldValues.map((field) => ({
            coordinatesKey: field.coordinates.toKey(),
            occupied: field.figure !== null,
            canCapture: Boolean(field.figure?.canBeCaptured() && field.figure?.getColor() !== playerColor),
        }));
    }

    public moveFigure(movement: Movement): void {
        const figure = this.getFigureByCoordinatesOrThrow(movement.from);
        this.getFieldUnderCoordinatesOrThrow(movement.from).figure = null;
        this.addFigure(figure, movement.to);
        figure.markAsMoved();
    }

    public addFigure(figure: Figure, coordinates: Coordinates): void {
        const field = this.getFieldUnderCoordinatesOrThrow(coordinates);
        field.figure = figure;
    }

    public getFigureByCoordinates(coordinates: Coordinates): Figure | null {
        return this.fields[coordinates.toKey()]?.figure;
    }

    private getFieldUnderCoordinatesOrThrow(coordinates: Coordinates): BoardField {
        const field = this.fields[coordinates.toKey()];
        if (!field) {
            throw new BoardFieldNotFound();
        }
        return field;
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

            if (blockingFigure !== null) {
                return true;
            }
        }
        return false;
    }

    public captureFigureByCoordinates(coordinates: Coordinates): void {
        const figure = this.getFigureByCoordinatesOrThrow(coordinates);
        this.capturedFigures.push(figure.figureDetails());
        this.getFieldUnderCoordinatesOrThrow(coordinates).figure = null;
    }
}
