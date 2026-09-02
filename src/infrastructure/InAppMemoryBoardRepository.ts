import type { BoardRepository } from "@/application/repositories/BoardRepository";
import type { BoardSettings } from "@/domain/services/BoardSettings";
import { FieldsBoard, type Board, type BoardState } from "@/domain/entities/CheesBoard";
import type { BoardField } from "@/domain/dtos";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export class InAppMemoryBoardRepository implements BoardRepository {
  private board: FieldsBoard | null = null;

  public constructor(private readonly boardSettings: BoardSettings) {}

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
    const [xSize, ySize] = this.boardSettings.getBoardSize();
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
