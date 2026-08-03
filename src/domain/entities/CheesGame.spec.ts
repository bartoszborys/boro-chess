import type { Board } from "@/domain/entities/CheesBoard";
import { CheesGame } from "@/domain/entities/CheesGame";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";

describe("CheesGame", () => {
  const game = new CheesGame();
  const movement = new Movement(new Coordinates(1, 2), new Coordinates(1, 3));
  const castlingMovement = new Movement(new Coordinates(1, 1), new Coordinates(1, 2));

  let board: Board;

  beforeEach(() => {
    board = {
      getFigureByCoordinates: jest.fn(),
      getFigureByCoordinatesOrThrow: jest.fn(),
      anyFigureOnCoordinates: jest.fn(),
      captureFigureByCoordinates: jest.fn(),
      moveFigure: jest.fn(),
      addFigure: jest.fn(),
    };
  });

  it("always moves the main figure", () => {
    const context: ValidatedMoveContext = {
      movement,
      capturing: false,
    };

    game.playerMove(board, context);

    expect(board.moveFigure).toHaveBeenCalledTimes(1);
    expect(board.moveFigure).toHaveBeenCalledWith(movement);
    expect(board.captureFigureByCoordinates).not.toHaveBeenCalled();
  });

  it("captures on the destination when capturing is true", () => {
    const context: ValidatedMoveContext = {
      movement,
      capturing: true,
    };

    game.playerMove(board, context);

    expect(board.captureFigureByCoordinates).toHaveBeenCalledWith(movement.to);
    expect(board.moveFigure).toHaveBeenCalledWith(movement);
  });

  it("moves the castling partner when castlingMovement is set", () => {
    const context: ValidatedMoveContext = {
      movement,
      capturing: false,
      castlingMovement,
    };

    game.playerMove(board, context);

    expect(board.moveFigure).toHaveBeenCalledTimes(2);
    expect(board.moveFigure).toHaveBeenCalledWith(movement);
    expect(board.moveFigure).toHaveBeenCalledWith(castlingMovement);
    expect(board.captureFigureByCoordinates).not.toHaveBeenCalled();
  });
});
