import { Direction } from "@/domain/value-objects/Direction";
import { HorseBehavior } from "@/domain/entities/behaviors/HorseBehavior";

describe("HorseBehavior", () => {
  const horse = new HorseBehavior();

  describe("getDirections", () => {
    it("returns all L-shaped directions with capture enabled and range 1", () => {
      const directions = horse.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({
            deltaX: 2,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 2,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -2,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -2,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: 2,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: -2,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: 2,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: -2,
            canCapture: true,
            maxRange: 1,
          }),
        ]),
      );
    });
  });
});
