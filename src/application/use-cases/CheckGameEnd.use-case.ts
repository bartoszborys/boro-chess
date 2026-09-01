import { type Board, type MoveAnalyzer, Movement } from "@/domain";
import type { BoardRepository } from "@/application/repositories/BoardRepository";
import type { GameRules } from "@/domain/services/GameRules";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Player } from "@/domain/entities/Player";
import type { BoardFigureState, GameEndState, ValidatedMoveContext } from "@/domain/dtos";
import { FigureColor } from "@/domain/enums";
import type { MoveMaker } from "@/domain/services/MoveMaker";

export class CheckGameEndUseCase {
  constructor(
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly boardRepository: BoardRepository,
    private readonly moveApplier: MoveMaker,
    private readonly gameRules: GameRules,
  ) {}

  public execute(player: Player): GameEndState | null {
    const board = this.boardRepository.getBoard();
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

        const peekedBoardState = this.moveApplier.peek(board, context, enemyColor);

        if (this.gameRules.boardValidStateForPlayer(peekedBoardState, enemyColor)) {
          return true;
        }
      }
    }

    return false;
  }
}
