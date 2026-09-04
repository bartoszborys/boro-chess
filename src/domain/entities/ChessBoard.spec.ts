import { FieldsBoard } from "@/domain/entities/ChessBoard";
import type { Figure } from "@/domain/entities/ChessFigure";
import type { MoveHistory } from "@/domain/entities/move-history/MoveHistory";
import { FigureColor, FigureName } from "@/domain/enums";
import { BoardFieldNotFound, FigureNotFound, MoveHistoryNotFound } from "@/domain/exceptions";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { BoardField } from "@/domain/dtos";
import { Movement } from "@/domain/value-objects/Movement";

const mockFigure = (overrides: Partial<Figure> = {}): Figure =>
  ({
    markAsMoved: jest.fn(),
    ...overrides,
  }) as unknown as Figure;

const mockMoveHistory = (overrides: Partial<MoveHistory> = {}): MoveHistory =>
  ({
    undo: jest.fn(),
    ...overrides,
  }) as unknown as MoveHistory;

describe("FieldsBoard", () => {
  describe("getFieldsState", () => {
    it("Should map fields to state with empty occupancy, capturable figure and coordinates key", () => {
      const emptyCoordinates = new Coordinates(1, 1);
      const enemyCoordinates = new Coordinates(2, 3);
      const friendlyCoordinates = new Coordinates(3, 4);
      const uncapturableEnemyCoordinates = new Coordinates(4, 5);

      const fields: Record<string, BoardField> = {
        [emptyCoordinates.toKey()]: {
          coordinates: emptyCoordinates,
          figure: null,
        },
        [enemyCoordinates.toKey()]: {
          coordinates: enemyCoordinates,
          figure: mockFigure({
            getColor: () => FigureColor.BLACK,
            canBeCaptured: () => true,
          }),
        },
        [friendlyCoordinates.toKey()]: {
          coordinates: friendlyCoordinates,
          figure: mockFigure({
            getColor: () => FigureColor.WHITE,
            canBeCaptured: () => true,
          }),
        },
        [uncapturableEnemyCoordinates.toKey()]: {
          coordinates: uncapturableEnemyCoordinates,
          figure: mockFigure({
            getColor: () => FigureColor.BLACK,
            canBeCaptured: () => false,
          }),
        },
      };

      const board = new FieldsBoard(fields);
      const state = board.getFieldsState(FigureColor.WHITE);

      expect(state).toEqual(
        expect.arrayContaining([
          {
            coordinatesKey: "1-1",
            occupied: false,
            canCapture: false,
          },
          {
            coordinatesKey: "2-3",
            occupied: true,
            canCapture: true,
          },
          {
            coordinatesKey: "3-4",
            occupied: true,
            canCapture: false,
          },
          {
            coordinatesKey: "4-5",
            occupied: true,
            canCapture: false,
          },
        ]),
      );
      expect(state).toHaveLength(4);
    });
  });

  describe("getFiguresState", () => {
    it("maps figures added to the board with name, color and coordinates", () => {
      const rookCoordinates = new Coordinates(2, 7);
      const knightCoordinates = new Coordinates(5, 3);
      const emptyCoordinates = new Coordinates(8, 1);

      const board = new FieldsBoard({
        [rookCoordinates.toKey()]: { coordinates: rookCoordinates, figure: null },
        [knightCoordinates.toKey()]: { coordinates: knightCoordinates, figure: null },
        [emptyCoordinates.toKey()]: { coordinates: emptyCoordinates, figure: null },
      });

      board.addFigure(
        mockFigure({
          getName: () => FigureName.ROOK,
          getColor: () => FigureColor.WHITE,
        }),
        rookCoordinates,
      );
      board.addFigure(
        mockFigure({
          getName: () => FigureName.KNIGHT,
          getColor: () => FigureColor.BLACK,
        }),
        knightCoordinates,
      );

      const state = board.getFiguresState();

      expect(state).toHaveLength(2);
      expect(state).toEqual(
        expect.arrayContaining([
          {
            name: FigureName.ROOK,
            color: FigureColor.WHITE,
            coordinates: rookCoordinates,
            isCaptured: false,
          },
          {
            name: FigureName.KNIGHT,
            color: FigureColor.BLACK,
            coordinates: knightCoordinates,
            isCaptured: false,
          },
        ]),
      );
    });

    it("marks remaining figures as captured when a matching name and color was captured", () => {
      const capturedCoordinates = new Coordinates(2, 2);
      const remainingPawnCoordinates = new Coordinates(7, 7);
      const queenCoordinates = new Coordinates(3, 3);

      const board = new FieldsBoard({
        [capturedCoordinates.toKey()]: {
          coordinates: capturedCoordinates,
          figure: mockFigure({
            getName: () => FigureName.PAWN,
            getColor: () => FigureColor.WHITE,
          }),
        },
        [remainingPawnCoordinates.toKey()]: {
          coordinates: remainingPawnCoordinates,
          figure: mockFigure({
            getName: () => FigureName.PAWN,
            getColor: () => FigureColor.WHITE,
          }),
        },
        [queenCoordinates.toKey()]: {
          coordinates: queenCoordinates,
          figure: mockFigure({
            getName: () => FigureName.QUEEN,
            getColor: () => FigureColor.BLACK,
          }),
        },
      });

      board.captureFigureByCoordinates(capturedCoordinates);

      const state = board.getFiguresState();

      expect(state).toHaveLength(2);
      expect(state).toEqual(
        expect.arrayContaining([
          {
            name: FigureName.PAWN,
            color: FigureColor.WHITE,
            coordinates: remainingPawnCoordinates,
            isCaptured: true,
          },
          {
            name: FigureName.QUEEN,
            color: FigureColor.BLACK,
            coordinates: queenCoordinates,
            isCaptured: false,
          },
        ]),
      );
    });
  });

  describe("looking up by coordinates methods", () => {
    const occupied = new Coordinates(3, 5);
    const empty = new Coordinates(4, 6);
    const missing = new Coordinates(8, 8);
    const figure = mockFigure();

    const createBoard = () =>
      new FieldsBoard({
        [occupied.toKey()]: { coordinates: occupied, figure },
        [empty.toKey()]: { coordinates: empty, figure: null },
      });

    it("returns the figure or null from getFigureByCoordinates", () => {
      const board = createBoard();

      expect(board.getFigureByCoordinates(occupied)).toBe(figure);
      expect(board.getFigureByCoordinates(empty)).toBeNull();
      expect(board.getFigureByCoordinates(missing)).toBeNull();
    });

    it("returns the figure from getFigureByCoordinatesOrThrow or throws FigureNotFound", () => {
      const board = createBoard();

      expect(board.getFigureByCoordinatesOrThrow(occupied)).toBe(figure);
      expect(() => board.getFigureByCoordinatesOrThrow(empty)).toThrow(FigureNotFound);
      expect(() => board.getFigureByCoordinatesOrThrow(missing)).toThrow(FigureNotFound);
    });

    it("detects whether any coordinate on a path is occupied", () => {
      const board = createBoard();

      expect(board.anyFigureOnCoordinates([empty, missing])).toBe(false);
      expect(board.anyFigureOnCoordinates([empty, occupied])).toBe(true);
      expect(board.anyFigureOnCoordinates([])).toBe(false);
    });
  });

  describe("addFigure", () => {
    it("places the figure on an existing field", () => {
      const coordinates = new Coordinates(2, 2);
      const figure = mockFigure();
      const fields: Record<string, BoardField> = {
        [coordinates.toKey()]: {
          coordinates,
          figure: null,
        },
      };

      const board = new FieldsBoard(fields);
      board.addFigure(figure, coordinates);

      expect(fields[coordinates.toKey()].figure).toBe(figure);
    });

    it("throws BoardFieldNotFound when the field does not exist", () => {
      const board = new FieldsBoard();

      expect(() => board.addFigure(mockFigure(), new Coordinates(2, 2))).toThrow(BoardFieldNotFound);
    });
  });

  describe("captureFigureByCoordinates", () => {
    it("removes the figure from the field", () => {
      const coordinates = new Coordinates(4, 4);
      const figure = mockFigure({
        getName: () => FigureName.BISHOP,
        getColor: () => FigureColor.BLACK,
      });

      const fields: Record<string, BoardField> = {
        [coordinates.toKey()]: {
          coordinates,
          figure,
        },
      };

      const board = new FieldsBoard(fields);
      board.captureFigureByCoordinates(coordinates);

      expect(fields[coordinates.toKey()].figure).toBeNull();
    });

    it("returns the removed figure", () => {
      const coordinates = new Coordinates(4, 4);
      const figure = mockFigure({
        getName: () => FigureName.BISHOP,
        getColor: () => FigureColor.BLACK,
      });

      const board = new FieldsBoard({
        [coordinates.toKey()]: {
          coordinates,
          figure,
        },
      });

      expect(board.captureFigureByCoordinates(coordinates)).toBe(figure);
    });

    it("throws FigureNotFound when there is no figure at the coordinates", () => {
      const emptyCoordinates = new Coordinates(1, 1);
      const board = new FieldsBoard({
        [emptyCoordinates.toKey()]: {
          coordinates: emptyCoordinates,
          figure: null,
        },
      });

      expect(() => board.captureFigureByCoordinates(emptyCoordinates)).toThrow(FigureNotFound);
    });
  });

  describe("moveFigure", () => {
    it("Should move the figure to the destination, mark it as moved and leave the source field empty", () => {
      const from = new Coordinates(1, 2);
      const to = new Coordinates(1, 3);
      const figure = mockFigure();

      const fields: Record<string, BoardField> = {
        [from.toKey()]: {
          coordinates: from,
          figure,
        },
        [to.toKey()]: {
          coordinates: to,
          figure: null,
        },
      };

      const board = new FieldsBoard(fields);
      board.moveFigure(new Movement(from, to));

      expect(fields[from.toKey()].figure).toBeNull();
      expect(fields[to.toKey()].figure).toBe(figure);
      expect(figure.markAsMoved).toHaveBeenCalled();
    });

    it("throws FigureNotFound when there is no figure at the source", () => {
      const from = new Coordinates(1, 2);
      const to = new Coordinates(1, 3);
      const board = new FieldsBoard({
        [from.toKey()]: { coordinates: from, figure: null },
        [to.toKey()]: { coordinates: to, figure: null },
      });

      expect(() => board.moveFigure(new Movement(from, to))).toThrow(FigureNotFound);
    });

    it("throws BoardFieldNotFound when the destination field does not exist", () => {
      const from = new Coordinates(1, 2);
      const to = new Coordinates(1, 3);
      const board = new FieldsBoard({
        [from.toKey()]: {
          coordinates: from,
          figure: mockFigure(),
        },
      });

      expect(() => board.moveFigure(new Movement(from, to))).toThrow(BoardFieldNotFound);
    });
  });

  describe("undoLastMove", () => {
    it("calls undo on the last added history entry", () => {
      const board = new FieldsBoard();
      const firstMove = mockMoveHistory();
      const lastMove = mockMoveHistory();

      board.addMoveHistory(firstMove);
      board.addMoveHistory(lastMove);
      board.undoLastMove();

      expect(lastMove.undo).toHaveBeenCalledWith(board);
      expect(firstMove.undo).not.toHaveBeenCalled();
    });

    it("throws MoveHistoryNotFound when history is empty", () => {
      const board = new FieldsBoard();

      expect(() => board.undoLastMove()).toThrow(MoveHistoryNotFound);
    });
  });
});
