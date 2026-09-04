import { Direction } from "@/domain/value-objects/Direction";
import { KingBehavior } from "@/domain/entities/behaviors/KingBehavior";
import { FigureName } from "@/domain/enums";

describe("KingBehavior", () => {
  const king = new KingBehavior();

  describe("getName", () => {
    it("returns king", () => {
      expect(king.getName()).toBe(FigureName.KING);
    });
  });

  describe("getDirections", () => {
    it("returns 10 directions", () => {
      expect(king.getDirections()).toHaveLength(10);
    });

    it.each([
      {
        name: "top",
        direction: new Direction({
          deltaX: 0,
          deltaY: 1,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "top-right",
        direction: new Direction({
          deltaX: 1,
          deltaY: 1,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "top-left",
        direction: new Direction({
          deltaX: -1,
          deltaY: 1,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "bottom",
        direction: new Direction({
          deltaX: 0,
          deltaY: -1,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "bottom-right",
        direction: new Direction({
          deltaX: 1,
          deltaY: -1,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "bottom-left",
        direction: new Direction({
          deltaX: -1,
          deltaY: -1,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "left",
        direction: new Direction({
          deltaX: -1,
          deltaY: 0,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "right",
        direction: new Direction({
          deltaX: 1,
          deltaY: 0,
          canCapture: true,
          maxRange: 1,
        }),
      },
      {
        name: "queenside castling",
        direction: new Direction({
          deltaX: -1,
          deltaY: 0,
          canCapture: true,
          maxRange: 3,
          minRange: 3,
          whenStartingPosition: true,
          castling: true,
        }),
      },
      {
        name: "kingside castling",
        direction: new Direction({
          deltaX: 1,
          deltaY: 0,
          canCapture: true,
          maxRange: 2,
          minRange: 2,
          whenStartingPosition: true,
          castling: true,
        }),
      },
    ])("includes $name direction", ({ direction }) => {
      expect(king.getDirections()).toEqual(expect.arrayContaining([direction]));
    });
  });
});
