import type { BoardRepository } from "@/core/application/repositories/BoardRepository";
import type { Board } from "@/core/domain/entities/Board";
import { Player } from "@/core/domain/entities/Player";
import type { BoardFigureState, GameEndState, ValidatedMoveContext } from "@/core/domain/dtos";
import { FigureColor } from "@/core/domain/enums";
import type { GameRules } from "@/core/domain/services/GameRules";
import type { MoveAnalyzer } from "@/core/domain/services/MoveAnalyzer";
import type { MoveMaker } from "@/core/domain/services/MoveMaker";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";
import { Movement } from "@/core/domain/value-objects/Movement";

export class CheckGameEndUseCase {
  constructor(
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly boardRepository: BoardRepository,
    private readonly moveMaker: MoveMaker,
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

        const peekedBoardState = this.moveMaker.peek(board, context, enemyColor);

        if (this.gameRules.boardValidStateForPlayer(peekedBoardState, enemyColor)) {
          return true;
        }
      }
    }

    return false;
  }
}
