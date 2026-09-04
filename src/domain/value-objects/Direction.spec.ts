import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";
import { Movement } from "@/domain/value-objects/Movement";

describe("Direction", () => {
  describe("reverse", () => {
    it("returns a new direction with negated deltas and the same options", () => {
      const direction = new Direction({
        deltaX: 2,
        deltaY: -3,
        whenEnemy: true,
        canCapture: false,
        maxRange: 4,
        minRange: 2,
        whenStartingPosition: true,
        castling: true,
      });

      const reversed = direction.reverse();

      expect(reversed).not.toBe(direction);
      expect(reversed).toEqual(
        new Direction({
          deltaX: -2,
          deltaY: 3,
          whenEnemy: true,
          canCapture: false,
          maxRange: 4,
          minRange: 2,
          whenStartingPosition: true,
          castling: true,
        }),
      );
    });
  });

  describe("matches", () => {
    const conditions = { capturing: false, hasMoved: false };

    describe("when deltaX is 0 and deltaY is not 0", () => {
      const direction = new Direction({ deltaX: 0, deltaY: 1 });

      it("matches a movement along Y", () => {
        const movement = new Movement(new Coordinates(2, 1), new Coordinates(2, 4));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(true);
      });

      it("does not match a movement off the Y axis", () => {
        const movement = new Movement(new Coordinates(2, 1), new Coordinates(3, 4));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(false);
      });

      it("does not match a movement in the opposite Y direction", () => {
        const movement = new Movement(new Coordinates(2, 4), new Coordinates(2, 1));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(false);
      });

      it("does not match when the Y scale is not an integer", () => {
        const stepped = new Direction({ deltaX: 0, deltaY: 2 });
        const movement = new Movement(new Coordinates(2, 1), new Coordinates(2, 4));

        const matches = stepped.matches(movement, conditions);

        expect(matches).toBe(false);
      });
    });

    describe("when deltaX is not 0 and deltaY is 0", () => {
      const direction = new Direction({ deltaX: 1, deltaY: 0 });

      it("matches a movement along X", () => {
        const movement = new Movement(new Coordinates(1, 2), new Coordinates(4, 2));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(true);
      });

      it("does not match a movement off the X axis", () => {
        const movement = new Movement(new Coordinates(1, 2), new Coordinates(4, 3));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(false);
      });

      it("does not match a movement in the opposite X direction", () => {
        const movement = new Movement(new Coordinates(4, 2), new Coordinates(1, 2));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(false);
      });

      it("does not match when the X scale is not an integer", () => {
        const stepped = new Direction({ deltaX: 2, deltaY: 0 });
        const movement = new Movement(new Coordinates(1, 2), new Coordinates(4, 2));

        const matches = stepped.matches(movement, conditions);

        expect(matches).toBe(false);
      });
    });

    describe("when both deltas are not 0", () => {
      const direction = new Direction({ deltaX: 1, deltaY: 1 });

      it("matches a movement along the diagonal", () => {
        const movement = new Movement(new Coordinates(1, 1), new Coordinates(4, 4));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(true);
      });

      it("does not match a movement off the diagonal", () => {
        const movement = new Movement(new Coordinates(1, 1), new Coordinates(4, 5));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(false);
      });
    });

    describe("when both deltas are 0", () => {
      it("does not match a movement", () => {
        const direction = new Direction({ deltaX: 0, deltaY: 0 });
        const movement = new Movement(new Coordinates(1, 1), new Coordinates(4, 5));

        const matches = direction.matches(movement, conditions);

        expect(matches).toBe(false);
      });
    });

    it.each([
      {
        name: "k is below minRange",
        steps: 1,
        minRange: 2,
        maxRange: 4,
        expected: false,
      },
      {
        name: "k equals minRange",
        steps: 2,
        minRange: 2,
        maxRange: 4,
        expected: true,
      },
      {
        name: "k equals maxRange",
        steps: 4,
        minRange: 2,
        maxRange: 4,
        expected: true,
      },
      {
        name: "k is above maxRange",
        steps: 5,
        minRange: 2,
        maxRange: 4,
        expected: false,
      },
    ])("range check: $name → $expected", ({ steps, minRange, maxRange, expected }) => {
      const directionX = new Direction({
        deltaX: 1,
        deltaY: 0,
        minRange,
        maxRange,
      });
      const movementX = new Movement(new Coordinates(0, 0), new Coordinates(steps, 0));

      expect(directionX.matches(movementX, conditions)).toBe(expected);

      const directionY = new Direction({
        deltaX: 0,
        deltaY: 1,
        minRange,
        maxRange,
      });
      const movementY = new Movement(new Coordinates(0, 0), new Coordinates(0, steps));

      expect(directionY.matches(movementY, conditions)).toBe(expected);
    });
  });
});
