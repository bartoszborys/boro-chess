import type { Board } from "@/core/domain/entities/Board";
import type { BoardState, ValidatedMoveContext } from "@/core/domain/dtos";
import { CaptureMoveHistory } from "@/core/domain/entities/move-history/CaptureMoveHistory";
import { CompositeMoveHistory } from "@/core/domain/entities/move-history/CompositeMoveHistory";
import type { MoveHistory } from "@/core/domain/entities/move-history/MoveHistory";
import { MovementMoveHistory } from "@/core/domain/entities/move-history/MovementMoveHistory";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { FigureColor } from "@/core/domain/enums";
import { NotImplementedException } from "@/core/domain/exceptions";
import type { Coordinates } from "@/core/domain/value-objects/Coordinates";
import type { MoveMaker } from "@/core/domain/services/MoveMaker";

export class CoreMoveMaker implements MoveMaker {
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

  public promote(_board: Board, _coordinates: Coordinates, _figureBehavior: FigureBehavior): void {
    throw new NotImplementedException();
  }
}
