import type { Board } from "@/domain/entities/ChessBoard";

export type MoveHistory = {
  undo: (board: Board) => void;
};
