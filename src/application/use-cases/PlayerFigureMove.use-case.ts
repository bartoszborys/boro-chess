import { type Game, type MoveAnalyzer, Movement } from "@/domain";
import type { BoardFactory } from "@/application/factories/BoardFactory";
import type { GameRulesValidator } from "@/domain/services/GameRules";
import { FigureInvalidMove, PlayerCannotMoveException } from "@/domain/exceptions";
import { Player } from "@/domain/entities/Player";
import type { PlayerFigureMoveResult } from "@/domain/value-objects/dto";

export class PlayerFigureMoveUseCase {
  constructor(
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly boardFactory: BoardFactory,
    private readonly game: Game,
    private readonly gameRules: GameRulesValidator,
  ) { }

  public execute(movement: Movement, player: Player): PlayerFigureMoveResult {
    if (!this.game.playersCanMove()) {
      throw new PlayerCannotMoveException(`Player cannot move`);
    }

    const board = this.boardFactory.getBoard();
    const context = this.moveAnalyzer.createValidatedMoveContextOrThrow(board, movement);
    const boardState = this.game.playerMove(board, context, player.color);

    if (!this.gameRules.boardValidStateForPlayer(boardState, player.color)) {
      this.game.undoLastMove(board);
      throw new FigureInvalidMove(`Invalid state after move`);
    }

    if (this.gameRules.promotionAvailable(boardState)) {
      this.game.awaitPromotion({ player, coordinates: movement.to });
      return {
        promotion: true,
      };
    }

    return {
      promotion: false,
    };
  }
}
