import type { Board } from "@/core/domain/entities/Board";

export type MoveHistory = {
  undo: (board: Board) => void;
};
