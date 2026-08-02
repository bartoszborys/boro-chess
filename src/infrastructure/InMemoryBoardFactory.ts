import { BoardFactory } from "@/application/factories/BoardFactory";
import { Board, BoardState, CheesBoard } from "@/domain/entities/CheesBoard";

export class InAppMemoryBoardFactory implements BoardFactory {
    private readonly board: CheesBoard = new CheesBoard([], []);

    public getBoard(): Board {
        return this.board;
    }

    public getBoardState(): BoardState {
        return this.board;
    }
}