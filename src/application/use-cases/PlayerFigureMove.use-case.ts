import { type MoveAnalyzer, Movement } from "@/domain";
import type { BoardRepository } from "@/application/repositories/BoardRepository";
import type { GameRepository } from "@/application/repositories/GameRepository";
import type { GameRules } from "@/domain/services/GameRules";
import { FigureInvalidMove, PlayerCannotMoveException } from "@/domain/exceptions";
import { Player } from "@/domain/entities/Player";
import type { PlayerFigureMoveResult } from "@/domain/dtos";
import type { MoveMaker } from "@/domain/services/MoveMaker";

export class PlayerFigureMoveUseCase {
  constructor(
    private readonly analyzer: MoveAnalyzer,
    private readonly boardRepository: BoardRepository,
    private readonly gameRepository: GameRepository,
    private readonly applier: MoveMaker,
    private readonly gameRules: GameRules,
  ) { }

  public execute(movement: Movement, player: Player): PlayerFigureMoveResult {
    const game = this.gameRepository.getGame();

    if (!game.playersCanMove(player)) {
      throw new PlayerCannotMoveException(`Player cannot move`);
    }

    const board = this.boardRepository.getBoard();
    const context = this.analyzer.createValidatedMoveContextOrThrow(board, movement);
    const boardState = this.applier.move(board, context, player.color);

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
