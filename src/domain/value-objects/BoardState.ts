import type { BoardFigureState } from "./BoardFigureState";
import type { BoardFieldState } from "./BoardFieldState";

export type BoardState = {
  figuresState: BoardFigureState[];
  fieldsState: BoardFieldState[];
};
