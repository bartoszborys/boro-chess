import { ChessFigure } from "@/domain/entities/ChessFigure";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { FigureColor, FigureName } from "@/domain/enums";
import { Direction } from "@/domain/value-objects/Direction";

class TestBehaviorA implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.PAWN;
  }

  public getDirections(): Direction[] {
    return [new Direction({ deltaX: 0, deltaY: 1, maxRange: 1 })];
  }
}

class TestKingBehavior implements FigureBehavior {
  public getName(): FigureName {
    return FigureName.KING;
  }

  public getDirections(): Direction[] {
    return [new Direction({ deltaX: 1, deltaY: 0, maxRange: 1 })];
  }
}

describe("ChessFigure", () => {
  describe("hasMoved", () => {
    it("starts unmoved, then follows markAsMoved and markAsNotMoved", () => {
      const figure = new ChessFigure(FigureColor.WHITE, new TestBehaviorA());

      expect(figure.hasMoved()).toBe(false);

      figure.markAsMoved();

      expect(figure.hasMoved()).toBe(true);

      figure.markAsNotMoved();

      expect(figure.hasMoved()).toBe(false);
    });
  });

  describe("behavior", () => {
    it("exposes the initial behavior name and directions", () => {
      const behavior = new TestBehaviorA();
      const figure = new ChessFigure(FigureColor.WHITE, behavior);

      expect(figure.getName()).toBe(behavior.getName());
      expect(figure.getDirections()).toEqual(behavior.getDirections());
    });

    it("can be captured unless the behavior is a king", () => {
      const capturable = new ChessFigure(FigureColor.WHITE, new TestBehaviorA());
      const king = new ChessFigure(FigureColor.WHITE, new TestKingBehavior());

      expect(capturable.canBeCaptured()).toBe(true);
      expect(king.canBeCaptured()).toBe(false);
    });
  });

  describe("promote", () => {
    it("replaces the behavior name, directions and capturability", () => {
      const figure = new ChessFigure(FigureColor.WHITE, new TestBehaviorA());
      const nextBehavior = new TestKingBehavior();

      figure.promote(nextBehavior);

      expect(figure.getName()).toBe(nextBehavior.getName());
      expect(figure.getDirections()).toEqual(nextBehavior.getDirections());
      expect(figure.canBeCaptured()).toBe(false);
    });
  });

  describe("isFriendly", () => {
    it("is friendly to the same color and not to an opponent", () => {
      const white = new ChessFigure(FigureColor.WHITE, new TestBehaviorA());
      const otherWhite = new ChessFigure(FigureColor.WHITE, new TestKingBehavior());
      const black = new ChessFigure(FigureColor.BLACK, new TestBehaviorA());

      expect(white.getColor()).toBe(FigureColor.WHITE);
      expect(black.getColor()).toBe(FigureColor.BLACK);
      expect(white.isFriendly(white)).toBe(true);
      expect(white.isFriendly(otherWhite)).toBe(true);
      expect(white.isFriendly(black)).toBe(false);
    });

    it("is not friendly to null", () => {
      const white = new ChessFigure(FigureColor.WHITE, new TestBehaviorA());

      expect(white.isFriendly(null)).toBe(false);
    });
  });
});
