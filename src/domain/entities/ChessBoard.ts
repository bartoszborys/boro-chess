import type { Figure } from "@/domain/entities/ChessFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { BoardField, BoardFieldState, BoardFigureState, FigureDetails } from "@/domain/dtos";
import { BoardFieldNotFound, FigureNotFound, MoveHistoryNotFound } from "@/domain/exceptions";
import { Movement } from "../value-objects/Movement";
import { FigureColor } from "@/domain/enums";
import type { MoveHistory } from "./move-history/MoveHistory";

export type BoardState = {
  getFiguresState(): BoardFigureState[];
};

export type Board = {
  undoLastMove(): void;
  addMoveHistory(move: MoveHistory): void;
  moveFigure(movement: Movement): void;
  getFieldsState(playerColor: FigureColor): BoardFieldState[];
  getFigureByCoordinates(coordinates: Coordinates): Figure | null;
  getFigureByCoordinatesOrThrow(coordinates: Coordinates): Figure;
  anyFigureOnCoordinates(path: Coordinates[]): boolean;
  captureFigureByCoordinates(coordinates: Coordinates): Figure;
  addFigure(figure: Figure, coordinates: Coordinates): void;
} & BoardState;

export class FieldsBoard implements Board, BoardState {
  private capturedFigures: FigureDetails[] = [];
  private moveHistory: MoveHistory[] = [];

  constructor(private fields: Record<string, BoardField> = {}) {}

  public undoLastMove(): void {
    const lastMove = this.moveHistory.pop();
    if (!lastMove) {
      throw new MoveHistoryNotFound();
    }
    lastMove.undo(this);
  }

  public getFiguresState(): BoardFigureState[] {
    const occupiedFields = Object.values(this.fields).filter(
      (field): field is BoardField & { figure: Figure } => field.figure !== null,
    );

    return occupiedFields.map(({ figure, coordinates }) => ({
      name: figure.getName(),
      color: figure.getColor(),
      coordinates,
      isCaptured:
        this.capturedFigures.find((item) => item.name === figure.getName() && item.color === figure.getColor()) !==
        undefined,
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
    return this.fields[coordinates.toKey()]?.figure ?? null;
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

  public captureFigureByCoordinates(coordinates: Coordinates): Figure {
    const figure = this.getFigureByCoordinatesOrThrow(coordinates);
    this.capturedFigures.push({
      name: figure.getName(),
      color: figure.getColor(),
    });
    this.getFieldUnderCoordinatesOrThrow(coordinates).figure = null;
    return figure;
  }

  public addMoveHistory(move: MoveHistory): void {
    this.moveHistory.push(move);
  }
}
