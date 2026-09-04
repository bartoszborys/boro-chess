import { Direction } from "@/domain/value-objects/Direction";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { FigureName } from "@/domain/enums";

describe("BishopBehavior", () => {
  const bishop = new BishopBehavior();

  describe("getName", () => {
    it("returns bishop", () => {
      expect(bishop.getName()).toBe(FigureName.BISHOP);
    });
  });

  describe("getDirections", () => {
    it("returns diagonal directions with capture enabled and infinite range", () => {
      const directions = bishop.getDirections();

      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({ deltaX: 1, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: 1, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: 1, canCapture: true }),
        ]),
      );
    });
  });
});
