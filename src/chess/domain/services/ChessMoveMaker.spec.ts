import type { Board } from "@/core/domain/entities/Board";
import { ChessMoveMaker } from "@/chess/domain/services/ChessMoveMaker";
import { PromotionMoveHistory } from "@/chess/domain/entities/move-history/PromotionMoveHistory";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { FigureColor } from "@/core/domain/enums";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";
import { Movement } from "@/core/domain/value-objects/Movement";
import type { BoardState, ValidatedMoveContext } from "@/core/domain/dtos";
import { FigureNotFound } from "@/core/domain/exceptions";
import type { MoveMaker } from "@/core/domain/services/MoveMaker";

describe("ChessMoveMaker", () => {
  const pawnFactory = { createPawn: jest.fn() };
  const movement = new Movement(new Coordinates(1, 2), new Coordinates(1, 3));
  const context: ValidatedMoveContext = {
    movement,
    capturing: false,
  };
  const boardState: BoardState = {
    figuresState: [],
    fieldsState: [],
  };

  let board: Board;
  let coreMoveMaker: MoveMaker;
  let moveMaker: ChessMoveMaker;

  beforeEach(() => {
    board = {
      getFigureByCoordinates: jest.fn(),
      getFigureByCoordinatesOrThrow: jest.fn(),
      anyFigureOnCoordinates: jest.fn(),
      captureFigureByCoordinates: jest.fn(),
      moveFigure: jest.fn(),
      addFigure: jest.fn(),
      getFieldsState: jest.fn(),
      addMoveHistory: jest.fn(),
      undoLastMove: jest.fn(),
      getFiguresState: jest.fn(),
    };
    coreMoveMaker = {
      move: jest.fn().mockReturnValue(boardState),
      peek: jest.fn().mockReturnValue(boardState),
      promote: jest.fn(),
    };
    moveMaker = new ChessMoveMaker(coreMoveMaker, pawnFactory);
  });

  describe("move", () => {
    it("delegates to the core move maker and returns its result", () => {
      const result = moveMaker.move(board, context, FigureColor.WHITE);

      expect(coreMoveMaker.move).toHaveBeenCalledWith(board, context, FigureColor.WHITE);
      expect(result).toBe(boardState);
    });
  });

  describe("peek", () => {
    it("delegates to the core move maker and returns its result", () => {
      const result = moveMaker.peek(board, context, FigureColor.WHITE);

      expect(coreMoveMaker.peek).toHaveBeenCalledWith(board, context, FigureColor.WHITE);
      expect(result).toBe(boardState);
    });
  });

  describe("promote", () => {
    it("promotes the figure at the given coordinates", () => {
      const coordinates = new Coordinates(1, 8);
      const figureBehavior = {} as FigureBehavior;
      const figure = { promote: jest.fn() };
      (board.getFigureByCoordinatesOrThrow as jest.Mock).mockReturnValue(figure);

      moveMaker.promote(board, coordinates, figureBehavior);

      expect(board.getFigureByCoordinatesOrThrow).toHaveBeenCalledWith(coordinates);
      expect(figure.promote).toHaveBeenCalledWith(figureBehavior);
    });

    it("adds promotion history after promote", () => {
      const coordinates = new Coordinates(1, 8);
      const figureBehavior = {} as FigureBehavior;
      (board.getFigureByCoordinatesOrThrow as jest.Mock).mockReturnValue({
        promote: jest.fn(),
      });

      moveMaker.promote(board, coordinates, figureBehavior);

      expect(board.addMoveHistory).toHaveBeenCalledWith(new PromotionMoveHistory(coordinates, pawnFactory));
    });

    it("throws FigureNotFound when there is no figure on the board", () => {
      const coordinates = new Coordinates(1, 8);
      (board.getFigureByCoordinatesOrThrow as jest.Mock).mockImplementation(() => {
        throw new FigureNotFound();
      });

      expect(() => moveMaker.promote(board, coordinates, {} as FigureBehavior)).toThrow(FigureNotFound);
      expect(board.addMoveHistory).not.toHaveBeenCalled();
    });

    it("does not delegate promote to the core move maker", () => {
      const coordinates = new Coordinates(1, 8);
      (board.getFigureByCoordinatesOrThrow as jest.Mock).mockReturnValue({
        promote: jest.fn(),
      });

      moveMaker.promote(board, coordinates, {} as FigureBehavior);

      expect(coreMoveMaker.promote).not.toHaveBeenCalled();
    });
  });
});
