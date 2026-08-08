import type { Board } from "@/domain/entities/CheesBoard";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";
import {
  CompositeMoveHistory,
  InMemoryCaptureHistory,
  InMemoryMovementHistory,
  type MoveHistory,
} from "@/domain/entities/move-history";

export interface Game {
  playerMove(board: Board, context: ValidatedMoveContext): void;
}

export class CheesGame implements Game {
  public playerMove(board: Board, context: ValidatedMoveContext): void {
    const { movement, capturing, castlingMovement } = context;
    const steps: MoveHistory[] = [];

    if (capturing) {
      const capturedFigure = board.captureFigureByCoordinates(movement.to);
      steps.push(new InMemoryCaptureHistory(capturedFigure, movement.to));
    }

    board.moveFigure(movement);
    steps.push(new InMemoryMovementHistory(movement));

    if (castlingMovement) {
      board.moveFigure(castlingMovement);
      steps.push(new InMemoryMovementHistory(castlingMovement));
    }

    board.addMoveHistory(new CompositeMoveHistory(steps));
  }
}
