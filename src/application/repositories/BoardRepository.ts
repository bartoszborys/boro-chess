import type { Board, BoardState } from "@/domain/entities/CheesBoard";

export interface BoardRepository {
  getBoard(): Board;
  getBoardState(): BoardState;
}
