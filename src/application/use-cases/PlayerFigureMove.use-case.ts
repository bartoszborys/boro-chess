import type { Game, MoveAnalyzer, Movement } from "@/domain";
import type { BoardFactory } from "@/application/factories/BoardFactory";

export class PlayerFigureMoveUseCase {
    constructor(
        private readonly moveAnalyzer: MoveAnalyzer,
        private readonly boardFactory: BoardFactory,
        private readonly game: Game,
    ) { }

    public execute(movement: Movement): void {
        const board = this.boardFactory.get();
        const context = this.moveAnalyzer.createValidatedMoveContext(board, movement);
        this.game.playerMove(board, context);
    }
}
