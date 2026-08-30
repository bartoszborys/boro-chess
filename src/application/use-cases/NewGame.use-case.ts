import { BoardFactory } from "@/application/factories/BoardFactory";
import type { BoardSettings } from "@/domain/services/BoardSettings";
import type { Board } from "@/domain/entities/CheesBoard";
import { CheesFigure } from "@/domain/entities/CheesFigure";
import { FigureColor } from "@/domain/enums";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
import { BlackPawnBehavior } from "@/domain/entities/behaviors/BlackPawnBehavior";
import { KingBehavior } from "@/domain/entities/behaviors/KingBehavior";
import { QueenBehavior } from "@/domain/entities/behaviors/QueenBehavior";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { KnightBehavior } from "@/domain/entities/behaviors/KnightBehavior";
import { RookBehavior } from "@/domain/entities/behaviors/RookBehavior";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class NewCheesGameUseCase {
  public constructor(
    private readonly boardFactory: BoardFactory,
    private readonly boardSettings: BoardSettings,
  ) {}

  public execute(): void {
    const board = this.boardFactory.getBoard();
    this.initializeBoardWithFigures(board);
  }

  private initializeBoardWithFigures(board: Board): void {
    const baseCoordinates = new Coordinates(1, 1);
    const [xSize] = this.boardSettings.getBoardSize();

    for (let index = 0; index < xSize; index++) {
      board.addFigure(new CheesFigure(FigureColor.WHITE, new WhitePawnBehavior()), baseCoordinates.add(index, 1));
      board.addFigure(new CheesFigure(FigureColor.BLACK, new BlackPawnBehavior()), baseCoordinates.add(index, 6));
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
        board.addFigure(new CheesFigure(player.color, behavior), baseCoordinates.add(index, player.yCoordinatesOffset));
      }
    }
  }
}
