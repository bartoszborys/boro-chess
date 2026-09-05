import type { BoardRepository } from "@/core/application/repositories/BoardRepository";
import type { NewGameUseCase } from "@/core/application/use-cases/NewGame.use-case";
import type { BoardSettings } from "@/core/domain/services/BoardSettings";
import type { Board } from "@/core/domain/entities/Board";
import { ChessFigure } from "@/chess/domain/entities/ChessFigure";
import { FigureColor } from "@/core/domain/enums";
import { WhitePawnBehavior } from "@/chess/domain/entities/behaviors/WhitePawnBehavior";
import { BlackPawnBehavior } from "@/chess/domain/entities/behaviors/BlackPawnBehavior";
import { KingBehavior } from "@/chess/domain/entities/behaviors/KingBehavior";
import { QueenBehavior } from "@/chess/domain/entities/behaviors/QueenBehavior";
import { BishopBehavior } from "@/chess/domain/entities/behaviors/BishopBehavior";
import { KnightBehavior } from "@/chess/domain/entities/behaviors/KnightBehavior";
import { RookBehavior } from "@/chess/domain/entities/behaviors/RookBehavior";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";

export class NewChessGameUseCase implements NewGameUseCase {
  public constructor(
    private readonly boardRepository: BoardRepository,
    private readonly boardSettings: BoardSettings,
  ) {}

  public execute(): void {
    const board = this.boardRepository.getBoard();
    this.initializeBoardWithFigures(board);
  }

  private initializeBoardWithFigures(board: Board): void {
    const baseCoordinates = new Coordinates(1, 1);
    const [xSize] = this.boardSettings.getBoardSize();

    for (let index = 0; index < xSize; index++) {
      board.addFigure(new ChessFigure(FigureColor.WHITE, new WhitePawnBehavior()), baseCoordinates.add(index, 1));
      board.addFigure(new ChessFigure(FigureColor.BLACK, new BlackPawnBehavior()), baseCoordinates.add(index, 6));
    }

    const players = [
      {
        yCoordinatesOffset: 0,
        color: FigureColor.WHITE,
      },
      {
        yCoordinatesOffset: 7,
        color: FigureColor.BLACK,
      },
    ];

    const behaviorsInOrder = [
      new RookBehavior(),
      new KnightBehavior(),
      new BishopBehavior(),
      new QueenBehavior(),
      new KingBehavior(),
      new BishopBehavior(),
      new KnightBehavior(),
      new RookBehavior(),
    ];

    for (const player of players) {
      for (const [index, behavior] of behaviorsInOrder.entries()) {
        board.addFigure(new ChessFigure(player.color, behavior), baseCoordinates.add(index, player.yCoordinatesOffset));
      }
    }
  }
}
