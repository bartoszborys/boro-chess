import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";
import { Movement } from "@/domain/value-objects/Movement";

describe("Direction", () => {
  describe("matchesMovement", () => {
    it.each([
      {
        name: "the movement delta equals the direction vector",
        deltaX: 25,
        deltaY: 25,
        toX: 25,
        toY: 25,
      },
      {
        name: "the direction is a unit step of the movement delta",
        deltaX: 1,
        deltaY: 1,
        toX: 25,
        toY: 25,
      },
      {
        name: "the movement delta equals an unequal direction vector",
        deltaX: 25,
        deltaY: 10,
        toX: 25,
        toY: 10,
      },
      {
        name: "the direction is a reduced step of an unequal movement delta",
        deltaX: 5,
        deltaY: 2,
        toX: 25,
        toY: 10,
      },
    ])("matches when $name", ({ deltaX, deltaY, toX, toY }) => {
      const direction = new Direction({ deltaX, deltaY });
      const movement = new Movement(
        new Coordinates(0, 0),
        new Coordinates(toX, toY),
      );

      expect(direction.matchesMovement(movement)).toBe(true);
    });

    it.each([
      {
        name: "the movement is not on the direction",
        deltaX: 1,
        deltaY: 0,
        toX: 25,
        toY: 10,
        fromX: 0,
        fromY: 0,
      },
      {
        name: "the movement keeps X but direction requires deltaX",
        deltaX: 1,
        deltaY: 4,
        toX: 1,
        toY: 5,
        fromX: 1,
        fromY: 1,
      },
      {
        name: "axes are independently divisible but not the same direction",
        deltaX: 1,
        deltaY: 1,
        toX: 25,
        toY: 10,
        fromX: 0,
        fromY: 0,
      },
      {
        name: "movement goes in the opposite direction",
        deltaX: 1,
        deltaY: 0,
        toX: -25,
        toY: 0,
        fromX: 0,
        fromY: 0,
      },
      {
        name: "movement keeps Y but direction requires deltaY",
        deltaX: 4,
        deltaY: 1,
        toX: 5,
        toY: 1,
        fromX: 1,
        fromY: 1,
      },
      {
        name: "scale factors on X and Y differ",
        deltaX: 5,
        deltaY: 2,
        toX: 25,
        toY: 4,
        fromX: 0,
        fromY: 0,
      },
      {
        name: "direction is a zero vector",
        deltaX: 0,
        deltaY: 0,
        toX: 5,
        toY: 5,
        fromX: 0,
        fromY: 0,
      },
    ])("does not match when $name", ({ deltaX, deltaY, toX, toY, fromX, fromY }) => {
      const direction = new Direction({ deltaX, deltaY });
      const movement = new Movement(
        new Coordinates(fromX, fromY),
        new Coordinates(toX, toY),
      );

      expect(direction.matchesMovement(movement)).toBe(false);
    });

    it.each([
      { deltaX: 0, deltaY: 1 },
      { deltaX: 0, deltaY: -1 },
      { deltaX: 1, deltaY: 0 },
      { deltaX: -1, deltaY: 0 },
      { deltaX: 1, deltaY: 1 },
      { deltaX: -1, deltaY: 1 },
      { deltaX: 1, deltaY: -1 },
      { deltaX: -1, deltaY: -1 },
    ])(
      "matches leaving from origin in unit direction ($deltaX, $deltaY)",
      (unitDirection) => {
        const direction = new Direction(unitDirection);
        const movement = new Movement(
          new Coordinates(0, 0),
          new Coordinates(unitDirection.deltaX * 5, unitDirection.deltaY * 5),
        );

        expect(direction.matchesMovement(movement)).toBe(true);
      },
    );
  });
});
