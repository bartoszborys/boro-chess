import type { Board, BoardState } from "@/core/domain/entities/Board";

export interface BoardRepository {
  getBoard(): Board;
  getBoardState(): BoardState;
}
