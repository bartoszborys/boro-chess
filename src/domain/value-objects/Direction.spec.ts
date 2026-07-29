import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";
import { Movement } from "@/domain/value-objects/Movement";

describe("Direction", () => {
  describe("matchesMovement", () => {
    it("matches when the movement delta equals the direction vector", () => {
      const direction = new Direction({ deltaX: 25, deltaY: 25 });
      const movement = new Movement(
        new Coordinates(0, 0),
        new Coordinates(25, 25),
      );

      expect(direction.matchesMovement(movement)).toBe(true);
    });

    it("matches when the direction is a unit step of the movement delta", () => {
      const direction = new Direction({ deltaX: 1, deltaY: 1 });
      const movement = new Movement(
        new Coordinates(0, 0),
        new Coordinates(25, 25),
      );

      expect(direction.matchesMovement(movement)).toBe(true);
    });

    it("matches when the movement delta equals an unequal direction vector", () => {
      const direction = new Direction({ deltaX: 25, deltaY: 10 });
      const movement = new Movement(
        new Coordinates(0, 0),
        new Coordinates(25, 10),
      );

      expect(direction.matchesMovement(movement)).toBe(true);
    });

    it("matches when the direction is a reduced step of an unequal movement delta", () => {
      const direction = new Direction({ deltaX: 5, deltaY: 2 });
      const movement = new Movement(
        new Coordinates(0, 0),
        new Coordinates(25, 10),
      );

      expect(direction.matchesMovement(movement)).toBe(true);
    });

    it("does not match when the movement is not on the direction", () => {
      const direction = new Direction({ deltaX: 1, deltaY: 0 });
      const movement = new Movement(
        new Coordinates(0, 0),
        new Coordinates(25, 10),
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
