import { Coordinates } from "@/domain/value-objects/Coordinates";
import { ChessBoard } from "@/domain/entities/CheesBoard";
import { Figure } from "@/domain/entities/Figure";
import type { MovementValidator } from "@/domain/entities/movements/MovementValidator";

const anyMovement: MovementValidator = {
  canMove: () => true,
  getDirections: () => [],
  getThroughCoordinates: () => [],
};

describe("ChessBoard", () => {
  describe("getFigureByCoordinates", () => {
    it("finds each figure by its coordinates after all figures are added", () => {
      const figures = [
        new Figure(new Coordinates(0, 0), anyMovement),
        new Figure(new Coordinates(1, 0), anyMovement),
        new Figure(new Coordinates(2, 0), anyMovement),
      ];
      const board = new ChessBoard(figures);

      expect(board.getFigureByCoordinates(new Coordinates(0, 0))).toBe(
        figures[0],
      );
      expect(board.getFigureByCoordinates(new Coordinates(1, 0))).toBe(
        figures[1],
      );
      expect(board.getFigureByCoordinates(new Coordinates(2, 0))).toBe(
        figures[2],
      );
    });

    it("returns undefined when no figure is at the coordinates", () => {
      const board = new ChessBoard([
        new Figure(new Coordinates(0, 0), anyMovement),
      ]);

      expect(
        board.getFigureByCoordinates(new Coordinates(5, 5)),
      ).toBeUndefined();
    });
  });

  describe("hasFigureMoveCollision", () => {
    it("detects a collision when another figure stands straight ahead on the path up", () => {
      const destinationCoordinates = new Coordinates(25, 30);
      const blockingFigureCoordinates = new Coordinates(25, 29);
      const currentFigureCoordinates = new Coordinates(25, 28);
      const throughCoordinates = [blockingFigureCoordinates, destinationCoordinates];

      const blockingFigure = new Figure(blockingFigureCoordinates, anyMovement);
      const movingFigure = new Figure(currentFigureCoordinates, {
        canMove: () => true,
        getDirections: () => [],
        getThroughCoordinates: () => throughCoordinates,
      });

      const board = new ChessBoard([movingFigure, blockingFigure]);

      expect(
        board.hasFigureMoveCollision(movingFigure, destinationCoordinates),
      ).toBe(true);
    });

    it("does not detect a collision when another figure stands to the right of the path up", () => {
      const destinationCoordinates = new Coordinates(25, 30);
      const blockingFigureCoordinates = new Coordinates(26, 29);
      const currentFigureCoordinates = new Coordinates(25, 28);
      const throughCoordinates = [new Coordinates(25, 29), destinationCoordinates];

      const figureOnTheRight = new Figure(blockingFigureCoordinates, anyMovement);
      const movingFigure = new Figure(currentFigureCoordinates, {
        canMove: () => true,
        getDirections: () => [],
        getThroughCoordinates: () => throughCoordinates,
      });

      const board = new ChessBoard([movingFigure, figureOnTheRight]);

      expect(
        board.hasFigureMoveCollision(movingFigure, destinationCoordinates),
      ).toBe(false);
    });
  });
});
