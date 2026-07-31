import type { Board } from "@/domain/entities/CheesBoard";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";

export interface Game {
  playerMove(board: Board, context: ValidatedMoveContext): void;
}

export class CheesGame implements Game {
  public playerMove(_board: Board, _context: ValidatedMoveContext): void {
    throw new Error("Not implemented");
  }
}
