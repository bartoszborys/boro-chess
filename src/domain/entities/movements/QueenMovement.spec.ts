import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";
import { QueenMovement } from "./QueenMovement";

describe("QueenMovement", () => {
  const queen = new QueenMovement();
  const from = new Coordinates(24, 24);

  describe("getThroughCoordinates", () => {
    it("returns the bishop collision path when bishop can move, not the tower path", () => {
      const movement = new Movement(from, new Coordinates(27, 27));

      expect(queen.getThroughCoordinates(movement)).toEqual([
        new Coordinates(25, 25),
        new Coordinates(26, 26),
      ]);
      expect(queen.getThroughCoordinates(movement)).not.toEqual([
        new Coordinates(25, 24),
        new Coordinates(26, 24),
      ]);
    });

    it("returns the tower collision path when tower can move and bishop cannot", () => {
      const movement = new Movement(from, new Coordinates(27, 24));

      expect(queen.getThroughCoordinates(movement)).toEqual([
        new Coordinates(25, 24),
        new Coordinates(26, 24),
      ]);
    });

    it("throws FigureInvalidMove when neither bishop nor tower can move", () => {
      expect(() =>
        queen.getThroughCoordinates(
          new Movement(from, new Coordinates(26, 25)),
        ),
      ).toThrow(FigureInvalidMove);
    });
  });

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
