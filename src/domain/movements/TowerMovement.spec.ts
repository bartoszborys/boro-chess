import { Direction } from "@/domain/value-objects/Direction";
import { TowerMovement } from "@/domain/movements/TowerMovement";

describe("TowerMovement", () => {
  const tower = new TowerMovement();

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
