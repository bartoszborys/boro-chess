import { Coordinates } from "@/domain/value-objects/Coordinates";
import { CheesBoard } from "@/domain/entities/CheesBoard";
import type { Figure } from "@/domain/entities/CheesFigure";

function createFigure(
  coordinates: Coordinates,
  throughCoordinates: Coordinates[] = [],
): Figure {
  return {
    isOn: (other) => coordinates.equals(other),
    moveTo: () => undefined,
    getDirectionTo: () => null,
    getThroughCoordinates: () => throughCoordinates,
  };
}

describe("ChessBoard", () => {
  describe("getFigureByCoordinates", () => {
    it("finds each figure by its coordinates after all figures are added", () => {
      const figures = [
        createFigure(new Coordinates(0, 0)),
        createFigure(new Coordinates(1, 0)),
        createFigure(new Coordinates(2, 0)),
      ];
      const board = new CheesBoard(figures);

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
      const board = new CheesBoard([createFigure(new Coordinates(0, 0))]);

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
      const throughCoordinates = [
        blockingFigureCoordinates,
        destinationCoordinates,
      ];

      const blockingFigure = createFigure(blockingFigureCoordinates);
      const movingFigure = createFigure(
        currentFigureCoordinates,
        throughCoordinates,
      );

      const board = new CheesBoard([movingFigure, blockingFigure]);

      expect(
        board.hasFigureMoveCollision(movingFigure, destinationCoordinates),
      ).toBe(true);
    });

    it("does not detect a collision when another figure stands to the right of the path up", () => {
      const destinationCoordinates = new Coordinates(25, 30);
      const blockingFigureCoordinates = new Coordinates(26, 29);
      const currentFigureCoordinates = new Coordinates(25, 28);
      const throughCoordinates = [
        new Coordinates(25, 29),
        destinationCoordinates,
      ];

      const figureOnTheRight = createFigure(blockingFigureCoordinates);
      const movingFigure = createFigure(
        currentFigureCoordinates,
        throughCoordinates,
      );

      const board = new CheesBoard([movingFigure, figureOnTheRight]);

      expect(
        board.hasFigureMoveCollision(movingFigure, destinationCoordinates),
      ).toBe(false);
    });

    it("passes capturing true to getThroughCoordinates when a figure stands on the destination", () => {
      const destination = new Coordinates(25, 30);
      const movingFigureCoordinates = new Coordinates(25, 25);
      const getThroughCoordinates = jest.fn(() => []);

      const targetFigure = createFigure(destination);
      const movingFigure: Figure = {
        ...createFigure(movingFigureCoordinates),
        getThroughCoordinates,
      };

      const board = new CheesBoard([movingFigure, targetFigure]);

      board.hasFigureMoveCollision(movingFigure, destination);

      expect(getThroughCoordinates).toHaveBeenCalledWith(destination, true);
    });

    it("passes capturing false to getThroughCoordinates when the destination is empty", () => {
      const destination = new Coordinates(25, 30);
      const movingFigureCoordinates = new Coordinates(25, 25);
      const getThroughCoordinates = jest.fn(() => []);

      const movingFigure: Figure = {
        ...createFigure(movingFigureCoordinates),
        getThroughCoordinates,
      };

      const board = new CheesBoard([movingFigure]);

      board.hasFigureMoveCollision(movingFigure, destination);

      expect(getThroughCoordinates).toHaveBeenCalledWith(destination, false);
    });
  });
});
