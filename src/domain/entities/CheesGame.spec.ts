import type { Board } from "@/domain/entities/CheesBoard";
import { CheesGame } from "@/domain/entities/CheesGame";
import { CompositeMoveHistory, MovementMoveHistory } from "@/domain/entities/move-history";
import { FigureColor } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import type { ValidatedMoveContext } from "@/domain/dtos";

describe("CheesGame", () => {
  const pawnFactory = { createPawn: jest.fn() };
  const game = new CheesGame(pawnFactory);
  const movement = new Movement(new Coordinates(1, 2), new Coordinates(1, 3));

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

  describe("playerMove", () => {
    it("always moves the main figure", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
      };

      game.playerMove(board, context, FigureColor.WHITE);

      expect(board.moveFigure).toHaveBeenCalledTimes(1);
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.captureFigureByCoordinates).not.toHaveBeenCalled();
      expect(board.addMoveHistory).toHaveBeenCalledWith(expect.any(CompositeMoveHistory));
    });

    it("captures on the destination when capturing is true", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: true,
      };

      game.playerMove(board, context, FigureColor.WHITE);

      expect(board.captureFigureByCoordinates).toHaveBeenCalledWith(movement.to);
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.addMoveHistory).toHaveBeenCalledWith(expect.any(CompositeMoveHistory));
    });

    it("moves the castling partner when castlingMovement is set", () => {
      const castlingMovement = new Movement(new Coordinates(1, 1), new Coordinates(1, 2));
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
        castlingMovement,
      };

      game.playerMove(board, context, FigureColor.WHITE);

      expect(board.moveFigure).toHaveBeenCalledTimes(2);
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.moveFigure).toHaveBeenCalledWith(castlingMovement);
      expect(board.captureFigureByCoordinates).not.toHaveBeenCalled();
      expect(board.addMoveHistory).toHaveBeenCalledWith(expect.any(CompositeMoveHistory));
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

      const result = game.playerMove(board, context, FigureColor.WHITE);

      expect(board.getFieldsState).toHaveBeenCalledWith(FigureColor.WHITE);
      expect(result).toEqual({ figuresState, fieldsState });
      expect(board.undoLastMove).not.toHaveBeenCalled();
    });

    describe("MovementMoveHistory", () => {
      it.each([true, false])("adds movement history with hasMovedBefore %s for a basic move", (hasMovedBefore) => {
        (board.getFigureByCoordinatesOrThrow as jest.Mock).mockReturnValue({
          hasMoved: jest.fn().mockReturnValue(hasMovedBefore),
        });

        game.playerMove(board, { movement, capturing: false }, FigureColor.WHITE);

        expect(board.addMoveHistory).toHaveBeenCalledWith(
          new CompositeMoveHistory([new MovementMoveHistory(movement, hasMovedBefore)]),
        );
      });

      it.each([true, false])("adds movement history with hasMovedBefore %s for a castling move", (hasMovedBefore) => {
        const castlingMovement = new Movement(new Coordinates(1, 1), new Coordinates(1, 2));
        (board.getFigureByCoordinatesOrThrow as jest.Mock).mockReturnValue({
          hasMoved: jest.fn().mockReturnValue(hasMovedBefore),
        });

        game.playerMove(board, { movement, capturing: false, castlingMovement }, FigureColor.WHITE);

        expect(board.addMoveHistory).toHaveBeenCalledWith(
          new CompositeMoveHistory([
            new MovementMoveHistory(movement, hasMovedBefore),
            new MovementMoveHistory(castlingMovement, hasMovedBefore),
          ]),
        );
      });
    });
  });

  describe("peekMove", () => {
    it("applies move, returns state, and always undoes", () => {
      const context: ValidatedMoveContext = {
        movement,
        capturing: false,
      };
      const figuresState = [{ coordinates: movement.to } as never];
      const fieldsState = [{ coordinatesKey: "1,3" } as never];
      (board.getFiguresState as jest.Mock).mockReturnValue(figuresState);
      (board.getFieldsState as jest.Mock).mockReturnValue(fieldsState);

      const result = game.peekMove(board, context, FigureColor.WHITE);

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

      expect(() => game.peekMove(board, context, FigureColor.WHITE)).toThrow("figures state failed");
      expect(board.moveFigure).toHaveBeenCalledWith(movement);
      expect(board.undoLastMove).toHaveBeenCalledTimes(1);
    });
  });
});
