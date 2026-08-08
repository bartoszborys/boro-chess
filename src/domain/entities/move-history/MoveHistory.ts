import type { Board } from "@/domain/entities/CheesBoard";

export type MoveHistory = {
  undo: (board: Board) => void;
};
