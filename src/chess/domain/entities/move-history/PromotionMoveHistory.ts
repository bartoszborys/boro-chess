import type { Board } from "@/core/domain/entities/Board";
import type { MoveHistory } from "@/core/domain/entities/move-history/MoveHistory";
import type { Coordinates } from "@/core/domain/value-objects/Coordinates";
import type { PawnFactory } from "@/chess/domain/factories/PawnFactory";

export class PromotionMoveHistory implements MoveHistory {
  constructor(
    private readonly to: Coordinates,
    private readonly pawnFactory: PawnFactory,
  ) {}

  public undo(board: Board): void {
    const figure = board.getFigureByCoordinatesOrThrow(this.to);
    const pawnBehavior = this.pawnFactory.createPawn(figure.getColor());
    figure.promote(pawnBehavior);
  }
}
