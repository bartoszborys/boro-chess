import { BoardFactory } from "@/application/factories/BoardFactory";
import type { Board } from "@/domain/entities/CheesBoard";
import { CheesFigure } from "@/domain/entities/CheesFigure";
import { FigureColor } from "@/domain/enums";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
import { BlackPawnBehavior } from "@/domain/entities/behaviors/BlackPawnBehavior";
import { KingBehavior } from "@/domain/entities/behaviors/KingBehavior";
import { QueenBehavior } from "@/domain/entities/behaviors/QueenBehavior";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { HorseBehavior } from "@/domain/entities/behaviors/HorseBehavior";
import { TowerBehavior } from "@/domain/entities/behaviors/TowerBehavior";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class NewCheesGameUseCase {
  public constructor(private readonly boardFactory: BoardFactory) {}

  public execute(): void {
    const board = this.boardFactory.getBoard();
    this.initializeBoardWithFigures(board);
  }

  private initializeBoardWithFigures(board: Board): void {
    const baseCoordinates = new Coordinates(1, 1);
    const [xSize, _] = this.boardFactory.getBoardSize();

    for (let index = 0; index < xSize; index++) {
      board.addFigure(
        new CheesFigure(FigureColor.WHITE, new WhitePawnBehavior()),
        baseCoordinates.add(index, 1),
      );
      board.addFigure(
        new CheesFigure(FigureColor.BLACK, new BlackPawnBehavior()),
        baseCoordinates.add(index, 6),
      );
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
      new TowerBehavior(),
      new HorseBehavior(),
      new BishopBehavior(),
      new QueenBehavior(),
      new KingBehavior(),
      new BishopBehavior(),
      new HorseBehavior(),
      new TowerBehavior(),
    ];

    for (const player of players) {
      for (const [index, behavior] of behaviorsInOrder.entries()) {
        board.addFigure(
          new CheesFigure(player.color, behavior),
          baseCoordinates.add(index, player.yCoordinatesOffset),
        );
      }
    }
  }
}
