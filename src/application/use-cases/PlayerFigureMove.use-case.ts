import type { Game, MoveAnalyzer, Movement } from "@/domain";
import type { BoardFactory } from "@/application/factories/BoardFactory";
import type { GameRulesValidator } from "@/domain/services/GameRules";
import type { FigureColor } from "@/domain/enums";
import { FigureInvalidMove } from "@/domain/exceptions";

export class PlayerFigureMoveUseCase {
  constructor(
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly boardFactory: BoardFactory,
    private readonly game: Game,
    private readonly gameRules: GameRulesValidator,
  ) {}

  public execute(movement: Movement, playerColor: FigureColor): void {
    const board = this.boardFactory.getBoard();
    const context = this.moveAnalyzer.createValidatedMoveContext(board, movement);
    this.game.playerMove(board, context);

    const figureStates = board.getFiguresState();
    const fieldsState = board.getFieldsState(playerColor);
    if (!this.gameRules.boardValidStateForPlayer(figureStates, fieldsState, playerColor)) {
      this.game.undoLastMove(board);
      throw new FigureInvalidMove(`Invalid state after move`);
    }
  }
}
