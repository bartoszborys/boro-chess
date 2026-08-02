import { Direction } from "@/domain/value-objects/Direction";
import { QueenBehavior } from "@/domain/entities/behaviors/QueenBehavior";

describe("QueenBehavior", () => {
  const queen = new QueenBehavior();

  describe("getDirections", () => {
    it("returns all orthogonal and diagonal directions with capture enabled and infinite range", () => {
      const directions = queen.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({ deltaX: 0, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: 0, deltaY: 1, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: 0, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: 0, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: 1, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: 1, canCapture: true }),
        ]),
      );
    });
  });
});
