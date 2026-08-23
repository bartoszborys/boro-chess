import type { Board } from "@/domain/entities/CheesBoard";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";
import {
  CompositeMoveHistory,
  InMemoryCaptureHistory,
  InMemoryMovementHistory,
  type MoveHistory,
} from "@/domain/entities/move-history";
import type { FigureColor } from "@/domain/enums";
import type { BoardState } from "@/domain/value-objects/BoardState";

export interface Game {
  playerMove(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState;
  peekMove(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState;
  undoLastMove(board: Board): void;
}

export class CheesGame implements Game {
  public playerMove(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState {
    const { movement, capturing, castlingMovement } = context;
    const steps: MoveHistory[] = [];

    if (capturing) {
      const capturedFigure = board.captureFigureByCoordinates(movement.to);
      steps.push(new InMemoryCaptureHistory(capturedFigure, movement.to));
    }

    const hasMovedBefore = board.getFigureByCoordinatesOrThrow(movement.from).hasMoved();
    board.moveFigure(movement);
    steps.push(new InMemoryMovementHistory(movement, hasMovedBefore));

    if (castlingMovement) {
      const castlingHasMovedBefore = board.getFigureByCoordinatesOrThrow(castlingMovement.from).hasMoved();
      board.moveFigure(castlingMovement);
      steps.push(new InMemoryMovementHistory(castlingMovement, castlingHasMovedBefore));
    }

    board.addMoveHistory(new CompositeMoveHistory(steps));

    return {
      figuresState: board.getFiguresState(),
      fieldsState: board.getFieldsState(playerColor),
    };
  }

  public undoLastMove(board: Board): void {
    board.undoLastMove();
  }

  public peekMove(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState {
    try {
      const afterMove = this.playerMove(board, context, playerColor);
      return afterMove;
    } finally {
      this.undoLastMove(board);
    }
  }
}
