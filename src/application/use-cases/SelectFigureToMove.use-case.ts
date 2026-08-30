import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import { BoardFactory } from "../factories/BoardFactory";
import { MoveAnalyzer } from "@/domain/services/MoveAnalyzer";
import { Movement } from "@/domain/value-objects/Movement";
import { GameRulesValidator } from "@/domain/services/GameRules";
import { Game } from "@/domain/entities/CheesGame";
import { FigureColor } from "@/domain/enums";
import type { ValidatedMoveContext } from "@/domain/dtos";

export class SelectFigureToMoveUseCase {
  constructor(
    private readonly boardFactory: BoardFactory,
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly game: Game,
    private readonly gameRules: GameRulesValidator,
  ) {}

  public execute(from: Coordinates, playerColor: FigureColor): CoordinatesKey[] {
    const board = this.boardFactory.getBoard();

    const validMovementKeys: CoordinatesKey[] = [];

    for (const possibleMoveToCoordinateKey of this.moveAnalyzer.createPossibleMoves(board, from)) {
      const movement = new Movement(from, Coordinates.fromKey(possibleMoveToCoordinateKey));
      const context: ValidatedMoveContext | null = this.moveAnalyzer.createValidatedMoveContextOrNull(board, movement);

      if (!context) {
        continue;
      }

      const peekBoardState = this.game.peekMove(board, context, playerColor);

      if (this.gameRules.boardValidStateForPlayer(peekBoardState, playerColor)) {
        validMovementKeys.push(possibleMoveToCoordinateKey);
      }
    }

    return validMovementKeys;
  }
}
