import type { Board } from "@/core/domain/entities/Board";
import type { Figure } from "@/core/domain/entities/Figure";
import type { MoveHistory } from "@/core/domain/entities/move-history/MoveHistory";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";

export class CaptureMoveHistory implements MoveHistory {
  constructor(
    private readonly capturedFigure: Figure,
    private readonly coordinates: Coordinates,
  ) {}

  public undo(board: Board): void {
    board.addFigure(this.capturedFigure, this.coordinates);
  }
}
