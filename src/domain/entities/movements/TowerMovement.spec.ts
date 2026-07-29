import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { TowerMovement } from "./TowerMovement";

describe("TowerMovement", () => {
  const tower = new TowerMovement();
  const from = new Coordinates(24, 24);

  describe("getThroughCoordinates", () => {
    it("returns intermediate squares when moving right, without destination", () => {
      expect(
        tower.getThroughCoordinates(
          new Movement(from, new Coordinates(27, 24)),
        ),
      ).toEqual([new Coordinates(25, 24), new Coordinates(26, 24)]);
    });

    it("returns intermediate squares when moving left, without destination", () => {
      expect(
        tower.getThroughCoordinates(
          new Movement(from, new Coordinates(21, 24)),
        ),
      ).toEqual([new Coordinates(23, 24), new Coordinates(22, 24)]);
    });

    it("returns intermediate squares when moving up, without destination", () => {
      expect(
        tower.getThroughCoordinates(
          new Movement(from, new Coordinates(24, 27)),
        ),
      ).toEqual([new Coordinates(24, 25), new Coordinates(24, 26)]);
    });

    it("returns intermediate squares when moving down, without destination", () => {
      expect(
        tower.getThroughCoordinates(
          new Movement(from, new Coordinates(24, 21)),
        ),
      ).toEqual([new Coordinates(24, 23), new Coordinates(24, 22)]);
    });
  });

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
