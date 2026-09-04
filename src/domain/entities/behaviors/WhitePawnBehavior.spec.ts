import { Direction } from "@/domain/value-objects/Direction";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
import { FigureName } from "@/domain/enums";

describe("WhitePawnBehavior", () => {
  const whitePawn = new WhitePawnBehavior();

  describe("getName", () => {
    it("returns pawn", () => {
      expect(whitePawn.getName()).toBe(FigureName.PAWN);
    });
  });

  describe("getDirections", () => {
    it("returns all possible directions including double-step from start", () => {
      const directions = whitePawn.getDirections();

      expect(directions).toHaveLength(4);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({
            deltaX: 0,
            deltaY: 1,
            canCapture: false,
            whenEnemy: false,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 0,
            deltaY: 1,
            canCapture: false,
            whenEnemy: false,
            maxRange: 2,
            whenStartingPosition: true,
          }),
          new Direction({
            deltaX: -1,
            deltaY: 1,
            canCapture: true,
            whenEnemy: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: 1,
            canCapture: true,
            whenEnemy: true,
            maxRange: 1,
          }),
        ]),
      );
    });
  });
});
