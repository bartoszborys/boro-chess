import { Figure } from "@/domain/entities/Figure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { MovementValidator } from "@/domain/entities/movements/MovementValidator";

const alwaysAllowed: MovementValidator = {
  canMove: () => true,
  getCollisionCoordinates: () => [],
};

describe("Figure", () => {
  describe("coordinates", () => {
    it("exposes initial X and Y passed to the constructor", () => {
      const figure = new Figure(3, 5, alwaysAllowed);

      expect(figure.getCoordinates()).toEqual(new Coordinates(3, 5));
    });
  });

  describe("moveTo", () => {
    it("updates current coordinates when the move is allowed", () => {
      const figure = new Figure(0, 0, alwaysAllowed);

      expect(figure.moveTo(new Coordinates(4, 7))).toBe(true);
      expect(figure.getCoordinates()).toEqual(new Coordinates(4, 7));
    });

    it("updates current coordinates to an abstract position 80, 24", () => {
      const figure = new Figure(0, 0, alwaysAllowed);

      expect(figure.moveTo(new Coordinates(80, 24))).toBe(true);
      expect(figure.getCoordinates()).toEqual(new Coordinates(80, 24));
    });

    it("asks the movement validator with current position and destination", () => {
      const canMove = jest.fn((_movement: Movement) => false);
      const movementValidator: MovementValidator = {
        canMove,
        getCollisionCoordinates: () => [],
      };
      const figure = new Figure(2, 3, movementValidator);

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
        getCollisionCoordinates: () => [],
      };
      const figure = new Figure(1, 1, movementValidator);

      expect(figure.moveTo(new Coordinates(1, 5))).toBe(true);
      expect(figure.getCoordinates()).toEqual(new Coordinates(1, 5));
      expect(figure.moveTo(new Coordinates(4, 4))).toBe(false);
      expect(figure.getCoordinates()).toEqual(new Coordinates(1, 5));
    });

    it("uses updated coordinates after a successful move when validating", () => {
      const canMove = jest.fn(() => true);
      const figure = new Figure(0, 0, {
        canMove,
        getCollisionCoordinates: () => [],
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
      const figure = new Figure(2, 3, {
        canMove,
        getCollisionCoordinates: () => [],
      });

      figure.moveTo(new Coordinates(5, 6), true);

      expect(canMove).toHaveBeenCalledWith(
        new Movement(new Coordinates(2, 3), new Coordinates(5, 6), true),
      );
    });
  });
});
