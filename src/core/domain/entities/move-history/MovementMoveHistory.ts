import type { Board } from "@/core/domain/entities/Board";
import type { MoveHistory } from "@/core/domain/entities/move-history/MoveHistory";
import { Movement } from "@/core/domain/value-objects/Movement";

export class MovementMoveHistory implements MoveHistory {
  constructor(
    private readonly movement: Movement,
    private readonly hasMovedBefore: boolean,
  ) {}

  public undo(board: Board): void {
    const reversedMovement = this.movement.reverse();
    board.moveFigure(reversedMovement);

    if (!this.hasMovedBefore) {
      board.getFigureByCoordinatesOrThrow(this.movement.from).markAsNotMoved();
    }
  }
}
