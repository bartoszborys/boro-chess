import type { Board } from "@/core/domain/entities/Board";
import type { BoardState, ValidatedMoveContext } from "@/core/domain/dtos";
import { PromotionMoveHistory } from "@/chess/domain/entities/move-history/PromotionMoveHistory";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { FigureColor } from "@/core/domain/enums";
import type { Coordinates } from "@/core/domain/value-objects/Coordinates";
import type { PawnFactory } from "@/chess/domain/factories/PawnFactory";
import type { MoveMaker } from "@/core/domain/services/MoveMaker";

export class ChessMoveMaker implements MoveMaker {
  constructor(
    private readonly moveMaker: MoveMaker,
    private readonly pawnFactory: PawnFactory,
  ) {}

  public move(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState {
    return this.moveMaker.move(board, context, playerColor);
  }

  public peek(board: Board, context: ValidatedMoveContext, playerColor: FigureColor): BoardState {
    return this.moveMaker.peek(board, context, playerColor);
  }

  public promote(board: Board, coordinates: Coordinates, figureBehavior: FigureBehavior): void {
    const promotionFigure = board.getFigureByCoordinatesOrThrow(coordinates);
    promotionFigure.promote(figureBehavior);
    board.addMoveHistory(new PromotionMoveHistory(coordinates, this.pawnFactory));
  }
}
