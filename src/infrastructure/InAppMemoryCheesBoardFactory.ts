import { BoardFactory } from "@/application/factories/BoardFactory";
import { BoardSettings } from "@/domain/BoardSettings";
import { Board, BoardState, FieldsBoard } from "@/domain/entities/CheesBoard";
import { BoardField } from "@/domain/value-objects/BoardField";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class InAppMemoryCheesBoardFactory implements BoardFactory {
  private board: FieldsBoard | null = null;

  public constructor(private readonly boardSettings: BoardSettings) { }

  public getBoard(): Board {
    return this.getOrCreateBoard();
  }

  public getBoardState(): BoardState {
    return this.getOrCreateBoard();
  }

  public getBoardSize(): [number, number] {
    return this.boardSettings.getBoardSize();
  }

  private getOrCreateBoard(): FieldsBoard {
    if (this.board === null) {
      this.board = new FieldsBoard(this.getBoardFields());
    }
    return this.board;
  }

  private getBoardFields(): Record<string, BoardField> {
    const [xSize, ySize] = this.getBoardSize();
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
