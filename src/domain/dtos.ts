import type { Player } from "@/domain/entities/Player";
import type { Figure } from "@/domain/entities/ChessFigure";
import type { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import type { Movement } from "@/domain/value-objects/Movement";
import type { FigureColor, FigureName } from "@/domain/enums";

export type PendingPromotion = {
  player: Player;
  coordinates: Coordinates;
};

export type PlayerFigureMoveResult = {
  promotion: boolean;
};

export type BoardFigureState = {
  coordinates: Coordinates;
  name: FigureName;
  color: FigureColor;
  isCaptured: boolean;
};

export type BoardFieldState = {
  coordinatesKey: CoordinatesKey;
  occupied: boolean;
  canCapture: boolean;
};

export type BoardState = {
  figuresState: BoardFigureState[];
  fieldsState: BoardFieldState[];
};

export type GameEndState = {
  draw: boolean;
  win: boolean;
  winner: Player | null;
};

export type ValidatedMoveContext = {
  movement: Movement;
  capturing: boolean;
  castlingMovement?: Movement;
};

export type FigureDetails = Readonly<{
  name: FigureName;
  color: FigureColor;
}>;

export type BoardField = {
  coordinates: Coordinates;
  figure: Figure | null;
};
