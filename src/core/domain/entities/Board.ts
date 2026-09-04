import type { Figure } from "@/core/domain/entities/Figure";
import type { BoardFieldState, BoardFigureState } from "@/core/domain/dtos";
import type { Coordinates } from "@/core/domain/value-objects/Coordinates";
import type { Movement } from "@/core/domain/value-objects/Movement";
import type { FigureColor } from "@/core/domain/enums";
import type { MoveHistory } from "@/core/domain/entities/move-history/MoveHistory";

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
