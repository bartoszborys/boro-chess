import { Board, BoardState } from "@/domain/entities/CheesBoard";

export interface BoardFactory {
  getBoard(): Board;
  getBoardState(): BoardState;
  getBoardSize(): [number, number];
}
