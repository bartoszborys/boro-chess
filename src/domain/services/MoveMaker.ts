import type { Board } from "@/domain/entities/ChessBoard";
import type { BoardState, ValidatedMoveContext } from "@/domain/dtos";
import {
  CaptureMoveHistory,
  CompositeMoveHistory,
  MovementMoveHistory,
  PromotionMoveHistory,
  type MoveHistory,
} from "@/domain/entities/move-history";
import type { FigureColor } from "@/domain/enums";
import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { FigureBehavior } from "@/domain/entities/behaviors";
import type { PawnFactory } from "@/application/factories/FigureBehaviorFactory";

export type MoveMaker = {
  move(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState;
  peek(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState;
  promote(board: Board, coordinates: Coordinates, figureBehavior: FigureBehavior): void;
};

export class ChessMoveMaker implements MoveMaker {
  constructor(private readonly pawnFactory: PawnFactory) {}

  public move(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState {
    const { movement, capturing, castlingMovement } = context;
    const steps: MoveHistory[] = [];

    if (capturing) {
      const capturedFigure = board.captureFigureByCoordinates(movement.to);
      steps.push(new CaptureMoveHistory(capturedFigure, movement.to));
    }

    const hasMovedBefore = board.getFigureByCoordinatesOrThrow(movement.from).hasMoved();
    board.moveFigure(movement);
    steps.push(new MovementMoveHistory(movement, hasMovedBefore));

    if (castlingMovement) {
      const castlingHasMovedBefore = board.getFigureByCoordinatesOrThrow(castlingMovement.from).hasMoved();
      board.moveFigure(castlingMovement);
      steps.push(new MovementMoveHistory(castlingMovement, castlingHasMovedBefore));
    }

    board.addMoveHistory(new CompositeMoveHistory(steps));

    return {
      figuresState: board.getFiguresState(),
      fieldsState: board.getFieldsState(playerColor),
    };
  }

  public peek(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState {
    try {
      return this.move(board, context, playerColor);
    } finally {
      board.undoLastMove();
    }
  }

  public promote(board: Board, coordinates: Coordinates, figureBehavior: FigureBehavior): void {
    const promotionFigure = board.getFigureByCoordinatesOrThrow(coordinates);
    promotionFigure.promote(figureBehavior);
    board.addMoveHistory(new PromotionMoveHistory(coordinates, this.pawnFactory));
  }
}
