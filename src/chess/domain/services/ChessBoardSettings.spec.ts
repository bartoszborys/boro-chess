import { ChessBoardSettings } from "@/chess/domain/services/ChessBoardSettings";

describe("ChessBoardSettings", () => {
  describe("getBoardSize", () => {
    it("returns an 8 by 8 board", () => {
      expect(new ChessBoardSettings().getBoardSize()).toEqual([8, 8]);
    });
  });
});
