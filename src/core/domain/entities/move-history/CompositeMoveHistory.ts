import type { Board } from "@/core/domain/entities/Board";
import type { MoveHistory } from "@/core/domain/entities/move-history/MoveHistory";

export class CompositeMoveHistory implements MoveHistory {
  constructor(private readonly steps: MoveHistory[]) {}

  public undo(board: Board): void {
    for (const step of [...this.steps].reverse()) {
      step.undo(board);
    }
  }
}
