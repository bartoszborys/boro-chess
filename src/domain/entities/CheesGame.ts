import type { Board } from "@/domain/entities/CheesBoard";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";

export interface Game {
  playerMove(board: Board, context: ValidatedMoveContext): void;
}

export class CheesGame implements Game {
  public playerMove(board: Board, context: ValidatedMoveContext): void {
    const { movement, capturing, castlingMovement } = context;

    if (capturing) {
      board.captureFigureByCoordinates(movement.to);
    }

    board.moveFigure(movement);

    if (castlingMovement) {
      board.moveFigure(castlingMovement);
    }
  }
}
