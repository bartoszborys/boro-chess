import type { BoardRepository } from "@/core/application/repositories/BoardRepository";
import type { BoardSettings } from "@/core/domain/services/BoardSettings";
import type { Board, BoardState } from "@/core/domain/entities/Board";
import { FieldsBoard } from "@/core/domain/entities/FieldsBoard";
import type { BoardField } from "@/core/domain/dtos";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";

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
