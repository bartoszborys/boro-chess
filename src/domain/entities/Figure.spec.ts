import { Figure } from "./Figure";
import {
  Coordinates,
  MovementValidator,
} from "./movements/MovementValidator";

const alwaysAllowed: MovementValidator = {
  canMove: () => true,
};

describe("Figure", () => {
  describe("coordinates", () => {
    it("exposes initial X and Y passed to the constructor", () => {
      const figure = new Figure(3, 5, alwaysAllowed);

      expect(figure.getCoordinates()).toEqual({ x: 3, y: 5 });
    });
  });

  describe("move", () => {
    it("updates current coordinates to the ones passed to move", () => {
      const figure = new Figure(0, 0, alwaysAllowed);

      figure.move(4, 7);

      expect(figure.getCoordinates()).toEqual({ x: 4, y: 7 });
    });

    it("updates current coordinates to an abstract position 80, 24", () => {
      const figure = new Figure(0, 0, alwaysAllowed);

      figure.move(80, 24);

      expect(figure.getCoordinates()).toEqual({ x: 80, y: 24 });
    });
  });

  describe("canMoveTo", () => {
    it("asks the movement validator with current position and destination", () => {
      const canMove = jest.fn(
        (_from: Coordinates, _to: Coordinates) => false,
      );
      const movementValidator: MovementValidator = { canMove };
      const figure = new Figure(2, 3, movementValidator);

      const result = figure.canMoveTo(5, 6);

      expect(canMove).toHaveBeenCalledWith({ x: 2, y: 3 }, { x: 5, y: 6 });
      expect(result).toBe(false);
    });

    it("returns true when the movement validator allows the move", () => {
      const movementValidator: MovementValidator = {
        canMove: (from, to) => from.x === to.x || from.y === to.y,
      };
      const figure = new Figure(1, 1, movementValidator);

      expect(figure.canMoveTo(1, 5)).toBe(true);
      expect(figure.canMoveTo(4, 4)).toBe(false);
    });

    it("uses updated coordinates after move when validating", () => {
      const canMove = jest.fn(() => true);
      const figure = new Figure(0, 0, { canMove });

      figure.move(3, 3);
      figure.canMoveTo(4, 4);

      expect(canMove).toHaveBeenCalledWith({ x: 3, y: 3 }, { x: 4, y: 4 });
    });
  });
});
