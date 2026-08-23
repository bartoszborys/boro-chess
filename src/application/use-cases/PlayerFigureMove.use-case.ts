import { type Board, type Game, type MoveAnalyzer, Movement } from "@/domain";
import type { BoardFactory } from "@/application/factories/BoardFactory";
import type { GameRulesValidator } from "@/domain/services/GameRules";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Player } from "@/domain/entities/Player";
import { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";
import { FigureColor } from "@/domain/enums";
import type { BoardFigureState } from "@/domain/value-objects/BoardFigureState";
import type { GameEndResult } from "@/domain/value-objects/GameEndResult";

export class PlayerFigureMoveUseCase {
  constructor(
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly boardFactory: BoardFactory,
    private readonly game: Game,
    private readonly gameRules: GameRulesValidator,
  ) {}

  public execute(movement: Movement, player: Player): GameEndResult | null {
    const board = this.boardFactory.getBoard();
    const context = this.moveAnalyzer.createValidatedMoveContextOrThrow(board, movement);
    const boardState = this.game.playerMove(board, context, player.color);

    if (!this.gameRules.boardValidStateForPlayer(boardState, player.color)) {
      this.game.undoLastMove(board);
      throw new FigureInvalidMove(`Invalid state after move`);
    }

    const enemyColor = player.getEnemyColor();

    if (this.hasAnyValidMove(board, boardState.figuresState, enemyColor)) {
      return null;
    }

    return this.gameRules.checkEnd(boardState, player);
  }

  private hasAnyValidMove(board: Board, figureStates: BoardFigureState[], enemyColor: FigureColor): boolean {
    for (const figureState of figureStates) {
      if (figureState.color !== enemyColor) {
        continue;
      }

      for (const possibleMove of this.moveAnalyzer.createPossibleMoves(board, figureState.coordinates)) {
        const possibleMovement = new Movement(figureState.coordinates, Coordinates.fromKey(possibleMove));
        const context: ValidatedMoveContext | null = this.moveAnalyzer.createValidatedMoveContextOrNull(
          board,
          possibleMovement,
        );

        if (!context) {
          continue;
        }

        const peekedBoardState = this.game.peekMove(board, context, enemyColor);

        if (this.gameRules.boardValidStateForPlayer(peekedBoardState, enemyColor)) {
          return true;
        }
      }
    }

    return false;
  }
}
