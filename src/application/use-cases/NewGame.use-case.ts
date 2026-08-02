import { BoardFactory } from "@/application/factories/BoardFactory";
import { CheesFigure, type Figure } from "@/domain/entities/CheesFigure";
import { FigureColor } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
import { BlackPawnBehavior } from "@/domain/entities/behaviors/BlackPawnBehavior";
import { KingBehavior } from "@/domain/entities/behaviors/KingBehavior";
import { QueenBehavior } from "@/domain/entities/behaviors/QueenBehavior";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { HorseBehavior } from "@/domain/entities/behaviors/HorseBehavior";
import { TowerBehavior } from "@/domain/entities/behaviors/TowerBehavior";

export class NewGameUseCase {
    public constructor(
        private readonly boardFactory: BoardFactory,
    ) { }

    public execute(): void {
        const board = this.boardFactory.getBoard();
        const figures = this.createInitialFigures(board.getBaseCoordinates());
        board.reset(figures);
    }

    private createInitialFigures(baseCoordinates: Coordinates): Figure[] {
        const whitePawns = new Array(8).fill(0).map((_, index) => new CheesFigure(
            baseCoordinates.add(index, 1), FigureColor.WHITE, new WhitePawnBehavior()));
        const blackPawns = new Array(8).fill(0).map((_, index) => new CheesFigure(
            baseCoordinates.add(index, 6), FigureColor.BLACK, new BlackPawnBehavior()));

        const players = [{
            yCoordinatesOffset: 0,
            color: FigureColor.WHITE,
        }, {
            yCoordinatesOffset: 7,
            color: FigureColor.BLACK,
        }];

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

        const figures = [
            ...whitePawns,
            ...blackPawns,
        ];

        for (const player of players) {
            for (const [index, behavior] of behaviorsInOrder.entries()) {
                figures.push(new CheesFigure(
                    baseCoordinates.add(index, player.yCoordinatesOffset),
                    player.color,
                    behavior,
                ));
            }
        }

        return figures;
    }
}
