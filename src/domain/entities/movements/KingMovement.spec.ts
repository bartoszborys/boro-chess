import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { KingMovement } from "./KingMovement";

describe("KingMovement", () => {
  const king = new KingMovement();
  const from = new Coordinates(24, 24);

  it("allows a move of one in any direction", () => {
    expect(king.canMove(new Movement(from, new Coordinates(24, 25)))).toBe(
      true,
    );
    expect(king.canMove(new Movement(from, new Coordinates(25, 24)))).toBe(
      true,
    );
    expect(king.canMove(new Movement(from, new Coordinates(25, 25)))).toBe(
      true,
    );
    expect(king.canMove(new Movement(from, new Coordinates(23, 23)))).toBe(
      true,
    );
  });

  it("rejects a move that is not exactly one in any direction", () => {
    expect(king.canMove(new Movement(from, new Coordinates(24, 26)))).toBe(
      false,
    );
    expect(king.canMove(new Movement(from, new Coordinates(26, 24)))).toBe(
      false,
    );
    expect(king.canMove(new Movement(from, new Coordinates(26, 26)))).toBe(
      false,
    );
    expect(king.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
      false,
    );
  });

  describe("domain directions", () => {
    it("allows move up", () => {
      expect(king.canMove(new Movement(from, new Coordinates(24, 25)))).toBe(
        true,
      );
    });

    it("allows move down", () => {
      expect(king.canMove(new Movement(from, new Coordinates(24, 23)))).toBe(
        true,
      );
    });

    it("allows move left", () => {
      expect(king.canMove(new Movement(from, new Coordinates(23, 24)))).toBe(
        true,
      );
    });

    it("allows move right", () => {
      expect(king.canMove(new Movement(from, new Coordinates(25, 24)))).toBe(
        true,
      );
    });

    it("allows move up-left", () => {
      expect(king.canMove(new Movement(from, new Coordinates(23, 25)))).toBe(
        true,
      );
    });

    it("allows move up-right", () => {
      expect(king.canMove(new Movement(from, new Coordinates(25, 25)))).toBe(
        true,
      );
    });

    it("allows move down-left", () => {
      expect(king.canMove(new Movement(from, new Coordinates(23, 23)))).toBe(
        true,
      );
    });

    it("allows move down-right", () => {
      expect(king.canMove(new Movement(from, new Coordinates(25, 23)))).toBe(
        true,
      );
    });
  });

  describe("getThroughCoordinates", () => {
    it("always returns an empty array", () => {
      expect(
        king.getThroughCoordinates(
          new Movement(from, new Coordinates(25, 25)),
        ),
      ).toEqual([]);
    });
  });

  describe("getDirections", () => {
    it("returns all directions with capture enabled and range 1", () => {
      const directions = king.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({ deltaX: 0, deltaY: -1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 0, deltaY: 1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 1, deltaY: 0, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -1, deltaY: 0, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 1, deltaY: -1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -1, deltaY: -1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 1, deltaY: 1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -1, deltaY: 1, canCapture: true, maxRange: 1 }),
        ]),
      );
    });
  });
});
