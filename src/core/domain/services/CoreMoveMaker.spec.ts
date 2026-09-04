import type { Board } from "@/core/domain/entities/Board";
import { CoreMoveMaker } from "@/core/domain/services/CoreMoveMaker";
import { CaptureMoveHistory } from "@/core/domain/entities/move-history/CaptureMoveHistory";
import { CompositeMoveHistory } from "@/core/domain/entities/move-history/CompositeMoveHistory";
import { MovementMoveHistory } from "@/core/domain/entities/move-history/MovementMoveHistory";
import type { Figure } from "@/core/domain/entities/Figure";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { FigureColor } from "@/core/domain/enums";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";
import { Movement } from "@/core/domain/value-objects/Movement";
import type { ValidatedMoveContext } from "@/core/domain/dtos";
import { NotImplementedException } from "@/core/domain/exceptions";

describe("CoreMoveMaker", () => {
  const moveMaker = new CoreMoveMaker();
  const movement = new Movement(new Coordinates(1, 2), new Coordinates(1, 3));
  const castlingMovement = new Movement(new Coordinates(1, 1), new Coordinates(1, 2));

  let board: Board;

  beforeEach(() => {
    board = {
      getFigureByCoordinates: jest.fn(),
      getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue({
        hasMoved: jest.fn().mockReturnValue(false),
      }),
      anyFigureOnCoordinates: jest.fn(),
      captureFigureByCoordinates: jest.fn(),
      moveFigure: jest.fn(),
      addFigure: jest.fn(),
      getFieldsState: jest.fn(),
      addMoveHistory: jest.fn(),
      undoLastMove: jest.fn(),
      getFiguresState: jest.fn(),
    };
  });

  describe("move", () => {
    it("always moves the main figure", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
      };

      moveMaker.move(board, context, FigureColor.WHITE);

      expect(board.moveFigure).toHaveBeenCalledTimes(1);
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.captureFigureByCoordinates).not.toHaveBeenCalled();
    });

    it("captures on the destination when capturing is true", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: true,
      };

      moveMaker.move(board, context, FigureColor.WHITE);

      expect(board.captureFigureByCoordinates).toHaveBeenCalledWith(movement.to);
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
    });

    it("moves the castling partner when castlingMovement is set", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
        castlingMovement,
      };

      moveMaker.move(board, context, FigureColor.WHITE);

      expect(board.moveFigure).toHaveBeenCalledTimes(2);
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.moveFigure).toHaveBeenCalledWith(castlingMovement);
      expect(board.captureFigureByCoordinates).not.toHaveBeenCalled();
    });

    it("returns board state for player after commit", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
      };
      const figuresState = [{ coordinates: movement.to } as never];
      const fieldsState = [{ coordinatesKey: "1,3" } as never];
      (board.getFiguresState as jest.Mock).mockReturnValue(figuresState);
      (board.getFieldsState as jest.Mock).mockReturnValue(fieldsState);

      const result = moveMaker.move(board, context, FigureColor.WHITE);

      expect(board.getFieldsState).toHaveBeenCalledWith(FigureColor.WHITE);
      expect(result).toEqual({ figuresState, fieldsState });
      expect(board.undoLastMove).not.toHaveBeenCalled();
    });

    it.each([
      { name: "hasMovedBefore", hasMovedBefore: true },
      { name: "hasNotMovedBefore", hasMovedBefore: false },
    ])("adds movement history with $name for a basic move", ({ hasMovedBefore }) => {
      (board.getFigureByCoordinatesOrThrow as jest.Mock).mockReturnValue({
        hasMoved: jest.fn().mockReturnValue(hasMovedBefore),
      });

      moveMaker.move(board, { movement, capturing: false }, FigureColor.WHITE);

      expect(board.addMoveHistory).toHaveBeenCalledWith(
        new CompositeMoveHistory([new MovementMoveHistory(movement, hasMovedBefore)]),
      );
    });

    it("adds movement history for a castling move", () => {
      moveMaker.move(board, { movement, capturing: false, castlingMovement }, FigureColor.WHITE);

      expect(board.addMoveHistory).toHaveBeenCalledWith(
        new CompositeMoveHistory([
          new MovementMoveHistory(movement, false),
          new MovementMoveHistory(castlingMovement, false),
        ]),
      );
    });

    it("adds capture history when capturing", () => {
      const capturedFigure = {} as Figure;
      (board.captureFigureByCoordinates as jest.Mock).mockReturnValue(capturedFigure);

      moveMaker.move(board, { movement, capturing: true }, FigureColor.WHITE);

      expect(board.addMoveHistory).toHaveBeenCalledWith(
        new CompositeMoveHistory([
          new CaptureMoveHistory(capturedFigure, movement.to),
          new MovementMoveHistory(movement, false),
        ]),
      );
    });

    it("adds capture and castling history together", () => {
      const capturedFigure = {} as Figure;
      (board.captureFigureByCoordinates as jest.Mock).mockReturnValue(capturedFigure);

      moveMaker.move(board, { movement, capturing: true, castlingMovement }, FigureColor.WHITE);

      expect(board.addMoveHistory).toHaveBeenCalledWith(
        new CompositeMoveHistory([
          new CaptureMoveHistory(capturedFigure, movement.to),
          new MovementMoveHistory(movement, false),
          new MovementMoveHistory(castlingMovement, false),
        ]),
      );
    });
  });

  describe("peek", () => {
    it("applies move, returns state, and always undoes", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
      };
      const figuresState = [{ coordinates: movement.to } as never];
      const fieldsState = [{ coordinatesKey: "1,3" } as never];
      (board.getFiguresState as jest.Mock).mockReturnValue(figuresState);
      (board.getFieldsState as jest.Mock).mockReturnValue(fieldsState);

      const result = moveMaker.peek(board, context, FigureColor.WHITE);

      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.getFieldsState).toHaveBeenCalledWith(FigureColor.WHITE);
      expect(result).toEqual({ figuresState, fieldsState });
      expect(board.undoLastMove).toHaveBeenCalledTimes(1);
    });

    it("undoes even when reading state throws", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
      };
      (board.getFiguresState as jest.Mock).mockImplementation(() => {
        throw new Error("figures state failed");
      });

      expect(() => moveMaker.peek(board, context, FigureColor.WHITE)).toThrow("figures state failed");
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.undoLastMove).toHaveBeenCalledTimes(1);
    });
  });

  describe("promote", () => {
    it("throws NotImplementedException", () => {
      expect(() => moveMaker.promote(board, new Coordinates(1, 8), {} as FigureBehavior)).toThrow(
        NotImplementedException,
      );
      expect(board.addMoveHistory).not.toHaveBeenCalled();
    });
  });
});
