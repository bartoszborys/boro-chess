import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { BishopMovement } from "./BishopMovement";

describe("BishopMovement", () => {
  const bishop = new BishopMovement();
  const from = new Coordinates(24, 24);

  describe("getThroughCoordinates", () => {
    it("returns intermediate squares on a diagonal path", () => {
      expect(
        bishop.getThroughCoordinates(
          new Movement(from, new Coordinates(27, 27)),
        ),
      ).toEqual([new Coordinates(25, 25), new Coordinates(26, 26)]);
    });

    it("returns an empty path for an adjacent diagonal move", () => {
      expect(
        bishop.getThroughCoordinates(
          new Movement(from, new Coordinates(25, 25)),
        ),
      ).toEqual([]);
    });

    it("returns intermediate squares for each diagonal direction", () => {
      expect(
        bishop.getThroughCoordinates(
          new Movement(from, new Coordinates(21, 27)),
        ),
      ).toEqual([new Coordinates(23, 25), new Coordinates(22, 26)]);
      expect(
        bishop.getThroughCoordinates(
          new Movement(from, new Coordinates(27, 21)),
        ),
      ).toEqual([new Coordinates(25, 23), new Coordinates(26, 22)]);
      expect(
        bishop.getThroughCoordinates(
          new Movement(from, new Coordinates(21, 21)),
        ),
      ).toEqual([new Coordinates(23, 23), new Coordinates(22, 22)]);
    });
  });

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
