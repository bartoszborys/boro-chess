import { Direction } from "@/domain/value-objects/Direction";
import { KnightBehavior } from "@/domain/entities/behaviors/KnightBehavior";
import { FigureName } from "@/domain/enums";

describe("KnightBehavior", () => {
  const knight = new KnightBehavior();

  describe("getName", () => {
    it("returns knight", () => {
      expect(knight.getName()).toBe(FigureName.KNIGHT);
    });
  });

  describe("getDirections", () => {
    it("returns all L-shaped directions with capture enabled and range 1", () => {
      const directions = knight.getDirections();

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
