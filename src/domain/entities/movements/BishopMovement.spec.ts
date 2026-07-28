import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { BishopMovement } from "./BishopMovement";

describe("BishopMovement", () => {
  const bishop = new BishopMovement();
  const from = new Coordinates(24, 24);

  describe("canMove", () => {
    it("allows a move when the position changes by the same integer on X and Y", () => {
      expect(bishop.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
        true,
      );
      expect(bishop.canMove(new Movement(from, new Coordinates(21, 21)))).toBe(
        true,
      );
      expect(bishop.canMove(new Movement(from, new Coordinates(27, 21)))).toBe(
        true,
      );
    });

    it("rejects a move when the X and Y deltas are not equal", () => {
      expect(bishop.canMove(new Movement(from, new Coordinates(27, 26)))).toBe(
        false,
      );
      expect(bishop.canMove(new Movement(from, new Coordinates(24, 27)))).toBe(
        false,
      );
      expect(bishop.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
        false,
      );
    });

    describe("domain directions", () => {
      it("allows move up-right", () => {
        expect(
          bishop.canMove(new Movement(from, new Coordinates(27, 27))),
        ).toBe(true);
      });

      it("allows move up-left", () => {
        expect(
          bishop.canMove(new Movement(from, new Coordinates(21, 27))),
        ).toBe(true);
      });

      it("allows move down-right", () => {
        expect(
          bishop.canMove(new Movement(from, new Coordinates(27, 21))),
        ).toBe(true);
      });

      it("allows move down-left", () => {
        expect(
          bishop.canMove(new Movement(from, new Coordinates(21, 21))),
        ).toBe(true);
      });
    });
  });

  describe("getCollisionCoordinates", () => {
    it("returns intermediate squares on a diagonal path", () => {
      expect(
        bishop.getCollisionCoordinates(new Movement(from, new Coordinates(27, 27))),
      ).toEqual([new Coordinates(25, 25), new Coordinates(26, 26)]);
    });

    it("returns an empty path for an adjacent diagonal move", () => {
      expect(
        bishop.getCollisionCoordinates(new Movement(from, new Coordinates(25, 25))),
      ).toEqual([]);
    });

    it("returns intermediate squares for each diagonal direction", () => {
      expect(
        bishop.getCollisionCoordinates(new Movement(from, new Coordinates(21, 27))),
      ).toEqual([new Coordinates(23, 25), new Coordinates(22, 26)]);
      expect(
        bishop.getCollisionCoordinates(new Movement(from, new Coordinates(27, 21))),
      ).toEqual([new Coordinates(25, 23), new Coordinates(26, 22)]);
      expect(
        bishop.getCollisionCoordinates(new Movement(from, new Coordinates(21, 21))),
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
