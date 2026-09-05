import { ChessPromotionRule } from "@/chess/domain/entities/rules/PromotionRule";
import type { BoardSettings } from "@/core/domain/services/BoardSettings";
import { FigureColor, FigureName } from "@/core/domain/enums";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";

class TestBoardSettings implements BoardSettings {
  constructor(private readonly size: [number, number]) {}

  public getBoardSize(): [number, number] {
    return this.size;
  }
}

describe("ChessPromotionRule", () => {
  const firstRank = 1;
  const lastRank = 4;
  const boardSettings = new TestBoardSettings([3, lastRank]);
  const rule = new ChessPromotionRule(boardSettings);

  describe("isPromotable", () => {
    it("is false when the figure is not a pawn", () => {
      const whiteQueenOnLastRank = rule.isPromotable(FigureName.QUEEN, FigureColor.WHITE, new Coordinates(1, lastRank));
      const blackQueenOnFirstRank = rule.isPromotable(
        FigureName.QUEEN,
        FigureColor.BLACK,
        new Coordinates(1, firstRank),
      );

      expect(whiteQueenOnLastRank).toBe(false);
      expect(blackQueenOnFirstRank).toBe(false);
    });

    it("is true for a white pawn on the last rank", () => {
      const whitePawnOnLastRank = rule.isPromotable(FigureName.PAWN, FigureColor.WHITE, new Coordinates(2, lastRank));

      expect(whitePawnOnLastRank).toBe(true);
    });

    it("is false for a white pawn off the last rank", () => {
      const whitePawnOneRankBeforeLast = rule.isPromotable(
        FigureName.PAWN,
        FigureColor.WHITE,
        new Coordinates(2, lastRank - 1),
      );
      const whitePawnOnFirstRank = rule.isPromotable(FigureName.PAWN, FigureColor.WHITE, new Coordinates(2, firstRank));

      expect(whitePawnOneRankBeforeLast).toBe(false);
      expect(whitePawnOnFirstRank).toBe(false);
    });

    it("is true for a black pawn on the first rank", () => {
      const blackPawnOnFirstRank = rule.isPromotable(FigureName.PAWN, FigureColor.BLACK, new Coordinates(2, firstRank));

      expect(blackPawnOnFirstRank).toBe(true);
    });

    it("is false for a black pawn off the first rank", () => {
      const blackPawnOneRankAfterFirst = rule.isPromotable(
        FigureName.PAWN,
        FigureColor.BLACK,
        new Coordinates(2, firstRank + 1),
      );
      const blackPawnOnLastRank = rule.isPromotable(FigureName.PAWN, FigureColor.BLACK, new Coordinates(2, lastRank));

      expect(blackPawnOneRankAfterFirst).toBe(false);
      expect(blackPawnOnLastRank).toBe(false);
    });
  });
});
