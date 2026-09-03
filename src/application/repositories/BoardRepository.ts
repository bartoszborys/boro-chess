import type { Board, BoardState } from "@/domain/entities/ChessBoard";

export interface BoardRepository {
  getBoard(): Board;
  getBoardState(): BoardState;
}
