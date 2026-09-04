import type { Board } from "@/core/domain/entities/Board";
import type { BoardState, ValidatedMoveContext } from "@/core/domain/dtos";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { FigureColor } from "@/core/domain/enums";
import type { Coordinates } from "@/core/domain/value-objects/Coordinates";

export type MoveMaker = {
  move(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState;
  peek(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState;
  promote(board: Board, coordinates: Coordinates, figureBehavior: FigureBehavior): void;
};
