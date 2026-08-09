import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import { BoardFactory } from "../factories/BoardFactory";
import { MoveAnalyzer } from "@/domain/services/MoveAnalyzer";
import { Movement } from "@/domain/value-objects/Movement";
import { GameRulesValidator } from "@/domain/services/GameRules";
import { Game } from "@/domain/entities/CheesGame";
import { FigureColor } from "@/domain/enums";

export class SelectFigureToMoveUseCase {
  constructor(
    private readonly boardFactory: BoardFactory,
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly game: Game,
    private readonly gameRules: GameRulesValidator,
  ) { }

  public execute(from: Coordinates, playerColor: FigureColor): CoordinatesKey[] {
    const board = this.boardFactory.getBoard();

    const validMovementKeys: CoordinatesKey[] = [];

    for (const possibleMoveToCoordinate of this.moveAnalyzer.createPossibleMoves(board, from)) {
      const movement = new Movement(from, Coordinates.fromKey(possibleMoveToCoordinate));
      const context = this.moveAnalyzer.createValidatedMoveContext(board, movement);
      this.game.playerMove(board, context);

      const isValid = this.gameRules.boardValidStateForPlayer(
        board.getFiguresState(),
        board.getFieldsState(playerColor),
        playerColor,
      );

      if (isValid) {
        validMovementKeys.push(possibleMoveToCoordinate);
      }

      this.game.undoLastMove(board);
    }

    return validMovementKeys;
  }
}
