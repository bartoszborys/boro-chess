import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { HorseMovement } from "./HorseMovement";

describe("HorseMovement", () => {
  const horse = new HorseMovement();
  const from = new Coordinates(24, 24);

  it("allows a move of two on one axis and one on the other", () => {
    expect(horse.canMove(new Movement(from, new Coordinates(26, 25)))).toBe(
      true,
    );
    expect(horse.canMove(new Movement(from, new Coordinates(25, 26)))).toBe(
      true,
    );
    expect(horse.canMove(new Movement(from, new Coordinates(22, 23)))).toBe(
      true,
    );
    expect(horse.canMove(new Movement(from, new Coordinates(23, 22)))).toBe(
      true,
    );
  });

  it("rejects a move that is not two on one axis and one on the other", () => {
    expect(horse.canMove(new Movement(from, new Coordinates(26, 26)))).toBe(
      false,
    );
    expect(horse.canMove(new Movement(from, new Coordinates(26, 24)))).toBe(
      false,
    );
    expect(horse.canMove(new Movement(from, new Coordinates(25, 25)))).toBe(
      false,
    );
    expect(horse.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
      false,
    );
  });

  describe("domain directions", () => {
    it("allows move up-left (two up, one left)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(23, 26)))).toBe(
        true,
      );
    });

    it("allows move up-right (two up, one right)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(25, 26)))).toBe(
        true,
      );
    });

    it("allows move right-up (two right, one up)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(26, 25)))).toBe(
        true,
      );
    });

    it("allows move right-down (two right, one down)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(26, 23)))).toBe(
        true,
      );
    });

    it("allows move left-up (two left, one up)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(22, 25)))).toBe(
        true,
      );
    });

    it("allows move left-down (two left, one down)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(22, 23)))).toBe(
        true,
      );
    });

    it("allows move down-right (two down, one right)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(25, 22)))).toBe(
        true,
      );
    });

    it("allows move down-left (two down, one left)", () => {
      expect(horse.canMove(new Movement(from, new Coordinates(23, 22)))).toBe(
        true,
      );
    });
  });

  describe("getCollisionCoordinates", () => {
    it("always returns an empty array", () => {
      expect(
        horse.getCollisionCoordinates(
          new Movement(from, new Coordinates(26, 25)),
        ),
      ).toEqual([]);
    });
  });

  describe("getDirections", () => {
    it("returns all L-shaped directions with capture enabled and range 1", () => {
      const directions = horse.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({ deltaX: 2, deltaY: 1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 2, deltaY: -1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -2, deltaY: 1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -2, deltaY: -1, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 1, deltaY: 2, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: 1, deltaY: -2, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -1, deltaY: 2, canCapture: true, maxRange: 1 }),
          new Direction({ deltaX: -1, deltaY: -2, canCapture: true, maxRange: 1 }),
        ]),
      );
    });
  });
});
