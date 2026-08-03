import { BoardFactory } from "@/application/factories/BoardFactory";
import { Board, BoardState, FieldsBoard } from "@/domain/entities/CheesBoard";
import { BoardField } from "@/domain/value-objects/BoardField";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class InAppMemoryCheesBoardFactory implements BoardFactory {
    private board: FieldsBoard | null = null;

    public getBoard(): Board {
        return this.getOrCreateBoard();
    }

    public getBoardState(): BoardState {
        return this.getOrCreateBoard();
    }

    private getOrCreateBoard(): FieldsBoard {
        if (this.board === null) {
            this.board = new FieldsBoard(this.getBoardFields());
        }
        return this.board;
    }

    private getBoardFields(): Record<string, BoardField> {
        const xSize = 8;
        const ySize = 8;
        const fields: Record<string, BoardField> = {};
        for (let x = 1; x <= xSize; x++) {
            for (let y = 1; y <= ySize; y++) {
                const coordinates = new Coordinates(x, y);

                fields[coordinates.toKey()] = {
                    coordinates,
                    figure: null,
                };
            }
        }
        return fields;
    }
}