import { Direction } from "@/domain/value-objects/Direction";
import { TowerBehavior } from "@/domain/entities/behaviors/TowerBehavior";

describe("TowerBehavior", () => {
  const tower = new TowerBehavior();

  describe("getDirections", () => {
    it("returns orthogonal directions with capture enabled and infinite range", () => {
      const directions = tower.getDirections();

      expect(directions).toHaveLength(4);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({ deltaX: 0, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: 0, deltaY: 1, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: 0, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: 0, canCapture: true }),
        ]),
      );
    });
  });
});
