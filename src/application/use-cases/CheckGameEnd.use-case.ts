import { type Board, type Game, type MoveAnalyzer, Movement } from "@/domain";
import type { BoardFactory } from "@/application/factories/BoardFactory";
import type { GameRulesValidator } from "@/domain/services/GameRules";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Player } from "@/domain/entities/Player";
import { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";
import { FigureColor } from "@/domain/enums";
import type { BoardFigureState } from "@/domain/value-objects/BoardFigureState";
import type { GameEndState } from "@/domain/value-objects/GameEndState";

export class CheckGameEndUseCase {
  constructor(
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly boardFactory: BoardFactory,
    private readonly game: Game,
    private readonly gameRules: GameRulesValidator,
  ) { }

  public execute(player: Player): GameEndState | null {
    const board = this.boardFactory.getBoard();
    const figuresState = board.getFiguresState();
    const enemyColor = player.getEnemyColor();

    if (this.hasAnyValidMove(board, figuresState, enemyColor)) {
      return null;
    }

    return this.gameRules.checkGameEndState(
      {
        figuresState,
        fieldsState: board.getFieldsState(player.color),
      },
      player,
    );
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
