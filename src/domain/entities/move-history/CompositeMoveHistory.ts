import type { Board } from "@/domain/entities/CheesBoard";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";

export class CompositeMoveHistory implements MoveHistory {
  constructor(private readonly steps: MoveHistory[]) {}

  public undo(board: Board): void {
    for (const step of [...this.steps].reverse()) {
      step.undo(board);
    }
  }
}
