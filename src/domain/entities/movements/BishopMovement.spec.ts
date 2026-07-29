import { Direction } from "@/domain/value-objects/Direction";
import { BishopMovement } from "./BishopMovement";

describe("BishopMovement", () => {
  const bishop = new BishopMovement();

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
