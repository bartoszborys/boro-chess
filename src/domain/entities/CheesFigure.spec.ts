import { CheesFigure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { MovementValidator } from "@/domain/entities/movements/MovementValidator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";
const alwaysAllowed: MovementValidator = {
  canMove: () => true,
  getDirections: () => [],
  getThroughCoordinates: () => [],
};

describe("Figure", () => {
  describe("coordinates", () => {
    it("exposes initial X and Y passed to the constructor", () => {
      const figure = new CheesFigure(new Coordinates(3, 5), alwaysAllowed);

      expect(figure.getCoordinates()).toEqual(new Coordinates(3, 5));
    });
  });

  describe("moveTo", () => {
    it("updates current coordinates when the move is allowed", () => {
      const figure = new CheesFigure(new Coordinates(0, 0), alwaysAllowed);

      expect(figure.moveTo(new Coordinates(4, 7))).toBe(true);
      expect(figure.getCoordinates()).toEqual(new Coordinates(4, 7));
    });

    it("updates current coordinates to an abstract position 80, 24", () => {
      const figure = new CheesFigure(new Coordinates(0, 0), alwaysAllowed);

      expect(figure.moveTo(new Coordinates(80, 24))).toBe(true);
      expect(figure.getCoordinates()).toEqual(new Coordinates(80, 24));
    });

    it("asks the movement validator with current position and destination", () => {
      const canMove = jest.fn((_movement: Movement) => false);
      const movementValidator: MovementValidator = {
        canMove,
        getDirections: () => [],
        getThroughCoordinates: () => [],
      };
      const figure = new CheesFigure(new Coordinates(2, 3), movementValidator);

      const result = figure.moveTo(new Coordinates(5, 6));

      expect(canMove).toHaveBeenCalledWith(
        new Movement(new Coordinates(2, 3), new Coordinates(5, 6)),
      );
      expect(result).toBe(false);
      expect(figure.getCoordinates()).toEqual(new Coordinates(2, 3));
    });

    it("returns true when the movement validator allows the move", () => {
      const movementValidator: MovementValidator = {
        canMove: (movement) =>
          movement.from.x === movement.to.x ||
          movement.from.y === movement.to.y,
        getDirections: () => [],
        getThroughCoordinates: () => [],
      };
      const figure = new CheesFigure(new Coordinates(1, 1), movementValidator);

      expect(figure.moveTo(new Coordinates(1, 5))).toBe(true);
      expect(figure.getCoordinates()).toEqual(new Coordinates(1, 5));
      expect(figure.moveTo(new Coordinates(4, 4))).toBe(false);
      expect(figure.getCoordinates()).toEqual(new Coordinates(1, 5));
    });

    it("uses updated coordinates after a successful move when validating", () => {
      const canMove = jest.fn(() => true);
      const figure = new CheesFigure(new Coordinates(0, 0), {
        canMove,
        getDirections: () => [],
        getThroughCoordinates: () => [],
      });

      figure.moveTo(new Coordinates(3, 3));
      figure.moveTo(new Coordinates(4, 4));

      expect(canMove).toHaveBeenNthCalledWith(
        2,
        new Movement(new Coordinates(3, 3), new Coordinates(4, 4)),
      );
    });

    it("passes capturing flag to the movement validator", () => {
      const canMove = jest.fn(() => true);
      const figure = new CheesFigure(new Coordinates(2, 3), {
        canMove,
        getDirections: () => [],
        getThroughCoordinates: () => [],
      });

      figure.moveTo(new Coordinates(5, 6), true);

      expect(canMove).toHaveBeenCalledWith(
        new Movement(new Coordinates(2, 3), new Coordinates(5, 6), true),
      );
    });
  });

  describe("getThroughCoordinates", () => {
    it("throws FigureCannotMove when the movement validator rejects the move", () => {
      const figure = new CheesFigure(new Coordinates(2, 3), {
        canMove: () => false,
        getDirections: () => [],
        getThroughCoordinates: () => [],
      });

      expect(() =>
        figure.getThroughCoordinates(new Coordinates(5, 6)),
      ).toThrow(FigureInvalidMove);
    });

    it("returns collision coordinates from the movement validator when the move is allowed", () => {
      const collisionCoordinates = [
        new Coordinates(3, 4),
        new Coordinates(4, 5),
        new Coordinates(5, 6),
      ];
      const figure = new CheesFigure(new Coordinates(2, 3), {
        canMove: () => true,
        getDirections: () => [],
        getThroughCoordinates: () => collisionCoordinates,
      });

      expect(figure.getThroughCoordinates(new Coordinates(5, 6))).toEqual(
        collisionCoordinates,
      );
    });
  });

  describe("getDirectionTo", () => {
    const upDirection = new Direction({ deltaX: 0, deltaY: 1 });
    const rightDirection = new Direction({ deltaX: 1, deltaY: 0 });
    const downDirection = new Direction({ deltaX: 0, deltaY: -1 });

    const figure = new CheesFigure(new Coordinates(20, 20), {
      canMove: () => true,
      getDirections: () => [upDirection, rightDirection, downDirection],
      getThroughCoordinates: () => [],
    });

    it("returns the matching direction when moving straight up", () => {
      expect(figure.getDirectionTo(new Coordinates(20, 25))).toEqual(upDirection);
    });

    it("returns null when the target coordinate does not match any direction", () => {
      expect(figure.getDirectionTo(new Coordinates(21, 25))).toBeNull();
    });
  });
});
