import type { Board } from "@/domain/entities/ChessBoard";
import { CompositeMoveHistory } from "@/domain/entities/move-history/CompositeMoveHistory";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";

const mockStep = (id: number, called: number[]): MoveHistory => ({
  undo: () => {
    called.push(id);
  },
});

describe("CompositeMoveHistory", () => {
  describe("undo", () => {
    it.each([
      { ids: [1], expected: [1] },
      { ids: [1, 2], expected: [2, 1] },
      { ids: [1, 2, 3], expected: [3, 2, 1] },
    ])("calls custom events $ids in reverse", ({ ids, expected }) => {
      const called: number[] = [];
      const board = {} as Board;
      const steps = ids.map((id) => mockStep(id, called));

      new CompositeMoveHistory(steps).undo(board);

      expect(called).toEqual(expected);
    });
  });
});
