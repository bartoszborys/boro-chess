import type { BoardRepository } from "@/core/application/repositories/BoardRepository";
import type { GameRepository } from "@/core/application/repositories/GameRepository";
import type { GameRules } from "@/core/domain/services/GameRules";
import type { MoveAnalyzer } from "@/core/domain/services/MoveAnalyzer";
import { Movement } from "@/core/domain/value-objects/Movement";
import { FigureInvalidMove, PlayerCannotMoveException } from "@/core/domain/exceptions";
import { Player } from "@/core/domain/entities/Player";
import type { PlayerFigureMoveResult } from "@/core/domain/dtos";
import type { MoveMaker } from "@/core/domain/services/MoveMaker";

export class PlayerFigureMoveUseCase {
  constructor(
    private readonly analyzer: MoveAnalyzer,
    private readonly boardRepository: BoardRepository,
    private readonly gameRepository: GameRepository,
    private readonly moveMaker: MoveMaker,
    private readonly gameRules: GameRules,
  ) { }

  public execute(movement: Movement, player: Player): PlayerFigureMoveResult {
    const game = this.gameRepository.getGame();

    if (!game.playersCanMove(player)) {
      throw new PlayerCannotMoveException(`Player cannot move`);
    }

    const board = this.boardRepository.getBoard();
    const context = this.analyzer.createValidatedMoveContextOrThrow(board, movement);
    const boardState = this.moveMaker.move(board, context, player.color);

    if (!this.gameRules.boardValidStateForPlayer(boardState, player.color)) {
      board.undoLastMove();
      throw new FigureInvalidMove(`Invalid state after move`);
    }

    const promotion = this.gameRules.promotionAvailable(boardState);
    if (promotion) {
      game.awaitPromotion({ player, coordinates: movement.to });
    }

    game.nextPlayerTurn();

    return { promotion };
  }
}
