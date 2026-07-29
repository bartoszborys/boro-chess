import { Direction } from "@/domain/value-objects/Direction";
import { KingMovement } from "./KingMovement";

describe("KingMovement", () => {
  const king = new KingMovement();

  describe("getDirections", () => {
    it("returns all directions with capture enabled and range 1", () => {
      const directions = king.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({
            deltaX: 0,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 0,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: 0,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: 0,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
        ]),
      );
    });
  });
});
