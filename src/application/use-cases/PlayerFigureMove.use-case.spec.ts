import { PlayerFigureMoveUseCase } from "./PlayerFigureMove.use-case";
import type { Board } from "@/domain/entities/CheesBoard";
import type { CheesFigure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import {
  FigureInvalidMove,
  FigureMoveCollision,
  FigureNotFound,
} from "@/domain/exceptions";

describe("PlayerFigureMoveUseCase", () => {
  const from = new Coordinates(25, 25);
  const to = new Coordinates(25, 30);

  function createFigure(moveToResult: boolean): CheesFigure {
    return {
      moveTo: jest.fn(() => moveToResult),
    } as unknown as CheesFigure;
  }

  describe("execute", () => {
  it("moves the figure to the target coordinates", () => {
    const figure = createFigure(true);
    const board: Board = {
      getFigureByCoordinates: jest.fn(() => figure),
      hasFigureMoveCollision: jest.fn(() => false),
    };
    const useCase = new PlayerFigureMoveUseCase(board);

    expect(() => useCase.execute(from, to)).not.toThrow();
    expect(board.getFigureByCoordinates).toHaveBeenCalledWith(from);
    expect(board.hasFigureMoveCollision).toHaveBeenCalledWith(figure, to);
    expect(figure.moveTo).toHaveBeenCalledWith(to);
  });

  describe("edge cases", () => {
    it("throws when the figure is not on the board", () => {
      const board: Board = {
        getFigureByCoordinates: () => undefined,
        hasFigureMoveCollision: jest.fn(),
      };
      const useCase = new PlayerFigureMoveUseCase(board);

      expect(() => useCase.execute(from, to)).toThrow(FigureNotFound);
      expect(board.hasFigureMoveCollision).not.toHaveBeenCalled();
    });

    it("throws when the board reports a collision", () => {
      const figure = createFigure(true);
      const board: Board = {
        getFigureByCoordinates: () => figure,
        hasFigureMoveCollision: () => true,
      };
      const useCase = new PlayerFigureMoveUseCase(board);

      expect(() => useCase.execute(from, to)).toThrow(FigureMoveCollision);
      expect(figure.moveTo).not.toHaveBeenCalled();
    });

    it("throws when there is no collision but moveTo returns false", () => {
      const figure = createFigure(false);
      const board: Board = {
        getFigureByCoordinates: () => figure,
        hasFigureMoveCollision: () => false,
      };
      const useCase = new PlayerFigureMoveUseCase(board);

      expect(() => useCase.execute(from, to)).toThrow(FigureInvalidMove);
      expect(figure.moveTo).toHaveBeenCalledWith(to);
    });
  });
  });
});
