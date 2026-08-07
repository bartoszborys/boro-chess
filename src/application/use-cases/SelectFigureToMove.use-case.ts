import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import { BoardFactory } from "../factories/BoardFactory";
import { MoveAnalyzer } from "@/domain/services/MoveAnalyzer";

export class SelectFigureToMoveUseCase {
    constructor(
        private readonly boardFactory: BoardFactory,
        private readonly moveAnalyzer: MoveAnalyzer,
    ) { }

    public execute(from: Coordinates): CoordinatesKey[] {
        const board = this.boardFactory.getBoard();
        return this.moveAnalyzer.createPossibleMoves(board, from);
    }
}
