import "@/domain/entities/rules/CheckRule";
import { ByBehaviorCheckRule } from "@/domain/entities/rules/ByBehaviorCheckRule";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { FigureColor, FigureName } from "@/domain/enums";
import { Direction } from "@/domain/value-objects/Direction";

class TestBehavior implements FigureBehavior {
  constructor(private readonly directions: Direction[]) {}

  public getName(): FigureName {
    return FigureName.PAWN;
  }

  public getDirections(): Direction[] {
    return this.directions;
  }
}

describe("ByBehaviorCheckRule", () => {
  const directions = [new Direction({ deltaX: 1, deltaY: 0, maxRange: 1 })];
  const behavior = new TestBehavior(directions);

  describe("handlesFigure", () => {
    const rule = new ByBehaviorCheckRule([FigureName.BISHOP, FigureName.QUEEN], behavior);

    it("handles listed figure names", () => {
      expect(rule.handlesFigure(FigureName.BISHOP)).toBe(true);
      expect(rule.handlesFigure(FigureName.QUEEN)).toBe(true);
    });

    it("does not handle a figure name outside the list", () => {
      expect(rule.handlesFigure(FigureName.ROOK)).toBe(false);
    });
  });

  describe("getDirections", () => {
    it("returns the directions from the given behavior", () => {
      const rule = new ByBehaviorCheckRule([FigureName.BISHOP], behavior);

      expect(rule.getDirections()).toBe(directions);
    });
  });

  describe("canApplyToColor", () => {
    it("applies to every color when no color is set", () => {
      const rule = new ByBehaviorCheckRule([FigureName.KING], behavior);

      expect(rule.canApplyToColor(FigureColor.WHITE)).toBe(true);
      expect(rule.canApplyToColor(FigureColor.BLACK)).toBe(true);
    });

    it("applies only to the given color", () => {
      const whiteRule = new ByBehaviorCheckRule([FigureName.PAWN], behavior, FigureColor.WHITE);
      const blackRule = new ByBehaviorCheckRule([FigureName.PAWN], behavior, FigureColor.BLACK);

      expect(whiteRule.canApplyToColor(FigureColor.WHITE)).toBe(true);
      expect(whiteRule.canApplyToColor(FigureColor.BLACK)).toBe(false);
      expect(blackRule.canApplyToColor(FigureColor.BLACK)).toBe(true);
      expect(blackRule.canApplyToColor(FigureColor.WHITE)).toBe(false);
    });
  });
});
