import { Coordinates, type CoordinatesKey } from "@/domain/value-objects/Coordinates";
import type { BoardRepository } from "@/application/repositories/BoardRepository";
import type { MoveAnalyzer } from "@/domain/services/MoveAnalyzer";
import { Movement } from "@/domain/value-objects/Movement";
import type { GameRules } from "@/domain/services/GameRules";
import { FigureColor } from "@/domain/enums";
import type { ValidatedMoveContext } from "@/domain/dtos";
import type { MoveMaker } from "@/domain/services/MoveMaker";
import { FigureColorMismatchException } from "@/domain/exceptions";

export class SelectFigureToMoveUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly moveAnalyzer: MoveAnalyzer,
    private readonly moveMaker: MoveMaker,
    private readonly gameRules: GameRules,
  ) {}

  public execute(from: Coordinates, playerColor: FigureColor): CoordinatesKey[] {
    const board = this.boardRepository.getBoard();

    const figure = board.getFigureByCoordinates(from);

    if (figure?.getColor() !== playerColor) {
      throw new FigureColorMismatchException(`Figure color mismatch`);
    }

    const validMovementKeys: CoordinatesKey[] = [];

    for (const possibleMoveToCoordinateKey of this.moveAnalyzer.createPossibleMoves(board, from)) {
      const movement = new Movement(from, Coordinates.fromKey(possibleMoveToCoordinateKey));
      const context: ValidatedMoveContext | null = this.moveAnalyzer.createValidatedMoveContextOrNull(board, movement);

      if (!context) {
        continue;
      }

      const peekBoardState = this.moveMaker.peek(board, context, playerColor);

      if (this.gameRules.boardValidStateForPlayer(peekBoardState, playerColor)) {
        validMovementKeys.push(possibleMoveToCoordinateKey);
      }
    }

    return validMovementKeys;
  }
}
