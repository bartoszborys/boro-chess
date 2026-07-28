import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { FigureInvalidMove } from "@/domain/exceptions/FigureCannotMove";
import { Direction } from "@/domain/value-objects/Direction";
import { BishopMovement } from "./BishopMovement";
import { TowerMovement } from "./TowerMovement";
import { QueenMovement } from "./QueenMovement";

describe("QueenMovement", () => {
  const bishop = new BishopMovement();
  const tower = new TowerMovement();
  const queen = new QueenMovement();
  const from = new Coordinates(24, 24);

  describe("canMove", () => {
    it("allows a move when only one axis changes", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(27, 24)))).toBe(
        true,
      );
      expect(queen.canMove(new Movement(from, new Coordinates(24, 21)))).toBe(
        true,
      );
    });

    it("allows a move when both axes change by the same amount", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
        true,
      );
      expect(queen.canMove(new Movement(from, new Coordinates(21, 27)))).toBe(
        true,
      );
    });

    it("rejects a move that is neither orthogonal nor diagonal", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(26, 25)))).toBe(
        false,
      );
      expect(queen.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
        false,
      );
    });

    describe("domain directions", () => {
      it("allows move right", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(27, 24)))).toBe(
          true,
        );
      });

      it("allows move left", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(21, 24)))).toBe(
          true,
        );
      });

      it("allows move up", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(24, 27)))).toBe(
          true,
        );
      });

      it("allows move down", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(24, 21)))).toBe(
          true,
        );
      });

      it("allows move up-right", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
          true,
        );
      });

      it("allows move up-left", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(21, 27)))).toBe(
          true,
        );
      });

      it("allows move down-right", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(27, 21)))).toBe(
          true,
        );
      });

      it("allows move down-left", () => {
        expect(queen.canMove(new Movement(from, new Coordinates(21, 21)))).toBe(
          true,
        );
      });
    });
  });

  describe("getThroughCoordinates", () => {
    it("returns the bishop collision path when bishop can move, not the tower path", () => {
      const movement = new Movement(from, new Coordinates(27, 27));

      expect(queen.getThroughCoordinates(movement)).toStrictEqual(
        bishop.getThroughCoordinates(movement),
      );
      expect(queen.getThroughCoordinates(movement)).not.toStrictEqual(
        tower.getThroughCoordinates(movement),
      );
    });

    it("returns the tower collision path when tower can move and bishop cannot", () => {
      const movement = new Movement(from, new Coordinates(27, 24));

      expect(bishop.canMove(movement)).toBe(false);
      expect(queen.getThroughCoordinates(movement)).toEqual(
        tower.getThroughCoordinates(movement),
      );
    });

    it("throws FigureInvalidMove when neither bishop nor tower can move", () => {
      expect(() =>
        queen.getThroughCoordinates(
          new Movement(from, new Coordinates(26, 25)),
        ),
      ).toThrow(FigureInvalidMove);
    });
  });

  describe("getDirections", () => {
    it("returns all orthogonal and diagonal directions with capture enabled and infinite range", () => {
      const directions = queen.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({ deltaX: 0, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: 0, deltaY: 1, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: 0, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: 0, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: -1, canCapture: true }),
          new Direction({ deltaX: 1, deltaY: 1, canCapture: true }),
          new Direction({ deltaX: -1, deltaY: 1, canCapture: true }),
        ]),
      );
    });
  });
});
