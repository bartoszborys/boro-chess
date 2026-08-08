import type { Board } from "@/domain/entities/CheesBoard";
import type { Figure } from "@/domain/entities/CheesFigure";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class InMemoryCaptureHistory implements MoveHistory {
  constructor(
    private readonly capturedFigure: Figure,
    private readonly coordinates: Coordinates,
  ) {}

  public undo(board: Board): void {
    board.addFigure(this.capturedFigure, this.coordinates);
  }
}
