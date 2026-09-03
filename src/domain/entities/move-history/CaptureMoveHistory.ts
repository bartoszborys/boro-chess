import type { Board } from "@/domain/entities/ChessBoard";
import type { Figure } from "@/domain/entities/ChessFigure";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class CaptureMoveHistory implements MoveHistory {
  constructor(
    private readonly capturedFigure: Figure,
    private readonly coordinates: Coordinates,
  ) {}

  public undo(board: Board): void {
    board.addFigure(this.capturedFigure, this.coordinates);
  }
}
