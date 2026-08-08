import type { Board } from "@/domain/entities/CheesBoard";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";
import { Movement } from "@/domain/value-objects/Movement";

export class InMemoryMovementHistory implements MoveHistory {
  constructor(private readonly movement: Movement) {}

  public undo(board: Board): void {
    const reversedMovement = this.movement.reverse();
    board.moveFigure(reversedMovement);
  }
}
