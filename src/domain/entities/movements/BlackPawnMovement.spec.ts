import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";
import { BlackPawnMovement } from "./BlackPawnMovement";

interface Delta {
  x: number;
  y: number;
}

function addDeltaToCoordinates(
  delta: Delta,
  coordinates: Coordinates,
): Coordinates {
  return new Coordinates(coordinates.x + delta.x, coordinates.y + delta.y);
}

describe("BlackPawnMovement", () => {
  const blackPawn = new BlackPawnMovement();
  const fromAdvancedPosition = new Coordinates(24, 25);

  describe("getThroughCoordinates", () => {
    it("returns the destination for a one-step forward move", () => {
      expect(
        blackPawn.getThroughCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition),
          ),
        ),
      ).toEqual([]);
    });

    it("returns the in-between square for a two-step forward move", () => {
      expect(
        blackPawn.getThroughCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 0, y: -2 }, fromAdvancedPosition),
          ),
        ),
      ).toEqual([addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition)]);
    });

    it("returns no collision coordinates when capturing down-right", () => {
      expect(
        blackPawn.getThroughCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 1, y: -1 }, fromAdvancedPosition),
            true,
          ),
        ),
      ).toEqual([]);
    });

    it("returns no collision coordinates when capturing down-left", () => {
      expect(
        blackPawn.getThroughCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: -1, y: -1 }, fromAdvancedPosition),
            true,
          ),
        ),
      ).toEqual([]);
    });

    it("throws FigureInvalidMove when the forward move is larger than two steps", () => {
      expect(() =>
        blackPawn.getThroughCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 0, y: -3 }, fromAdvancedPosition),
          ),
        ),
      ).toThrow(FigureInvalidMove);
    });
  });

  describe("getDirections", () => {
    it("returns all possible directions including double-step from start", () => {
      const directions = blackPawn.getDirections();

      expect(directions).toHaveLength(4);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({
            deltaX: 0,
            deltaY: -1,
            canCapture: false,
            whenEnemy: false,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 0,
            deltaY: -1,
            canCapture: false,
            whenEnemy: false,
            maxRange: 2,
            whenStartingPosition: true,
          }),
          new Direction({
            deltaX: -1,
            deltaY: -1,
            canCapture: true,
            whenEnemy: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: -1,
            canCapture: true,
            whenEnemy: true,
            maxRange: 1,
          }),
        ]),
      );
    });
  });
});
