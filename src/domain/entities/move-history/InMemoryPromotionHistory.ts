import type { Board } from "@/domain/entities/CheesBoard";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";
import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { PawnFactory } from "@/application/factories/FigureBehaviorFactory";

export class InMemoryPromotionHistory implements MoveHistory {
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

