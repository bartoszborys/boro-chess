import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import { BoardRepository } from "@/application/repositories/BoardRepository";
import { MoveAnalyzer } from "@/domain/services/MoveAnalyzer";
import { Movement } from "@/domain/value-objects/Movement";
import { GameRules } from "@/domain/services/GameRules";
import { FigureColor } from "@/domain/enums";
import type { ValidatedMoveContext } from "@/domain/dtos";
import type { MoveMaker } from "@/domain/services/MoveMaker";

export class SelectFigureToMoveUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly moveApplier: MoveMaker,
    private readonly gameRules: GameRules,
  ) {}

  public execute(from: Coordinates, playerColor: FigureColor): CoordinatesKey[] {
    const board = this.boardRepository.getBoard();

    const validMovementKeys: CoordinatesKey[] = [];

    for (const possibleMoveToCoordinateKey of this.moveAnalyzer.createPossibleMoves(board, from)) {
      const movement = new Movement(from, Coordinates.fromKey(possibleMoveToCoordinateKey));
      const context: ValidatedMoveContext | null = this.moveAnalyzer.createValidatedMoveContextOrNull(board, movement);

      if (!context) {
        continue;
      }

      const peekBoardState = this.moveApplier.peek(board, context, playerColor);

      if (this.gameRules.boardValidStateForPlayer(peekBoardState, playerColor)) {
        validMovementKeys.push(possibleMoveToCoordinateKey);
      }
    }

    return validMovementKeys;
  }
}
