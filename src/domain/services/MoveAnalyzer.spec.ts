import type { Board } from "@/domain/entities/ChessBoard";
import type { Figure } from "@/domain/entities/ChessFigure";
import { ChessMoveAnalyzer } from "@/domain/services/MoveAnalyzer";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import { FigureColor, FigureName } from "@/domain/enums";
import { FigureInvalidMove, FigureMoveCollision } from "@/domain/exceptions";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";
import { Movement } from "@/domain/value-objects/Movement";
import type { ValidatedMoveContext } from "@/domain/dtos";

describe("ChessMoveAnalyzer", () => {
  describe("createPossibleMoves", () => {
    it("should stop at the first capturable figure when two are on the same direction", () => {
      const from = new Coordinates(1, 1);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: jest
          .fn()
          .mockReturnValue([
            new Coordinates(1, 2),
            new Coordinates(1, 3),
            new Coordinates(1, 4),
            new Coordinates(1, 5),
            new Coordinates(1, 6),
          ]),
      };

      const figure = {
        getColor: () => FigureColor.WHITE,
        getDirections: () => [new Direction({ deltaX: 0, deltaY: 1, maxRange: 8 })],
        hasMoved: () => false,
      } as unknown as Figure;

      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-1", occupied: false, canCapture: false },
          { coordinatesKey: "1-2", occupied: false, canCapture: false },
          { coordinatesKey: "1-3", occupied: false, canCapture: false },
          { coordinatesKey: "1-4", occupied: true, canCapture: true },
          { coordinatesKey: "1-5", occupied: false, canCapture: false },
          { coordinatesKey: "1-6", occupied: true, canCapture: true },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(possibleMoves).toEqual(["1-2", "1-3", "1-4"]);
    });

    it("should not include blocked fields that cannot be captured", () => {
      const from = new Coordinates(1, 1);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: jest
          .fn()
          .mockReturnValue([new Coordinates(1, 2), new Coordinates(1, 3), new Coordinates(1, 4)]),
      };

      const figure = {
        getColor: () => FigureColor.WHITE,
        getDirections: () => [new Direction({ deltaX: 0, deltaY: 1, maxRange: 8 })],
        hasMoved: () => false,
      } as unknown as Figure;

      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-1", occupied: false, canCapture: false },
          { coordinatesKey: "1-2", occupied: false, canCapture: false },
          { coordinatesKey: "1-3", occupied: true, canCapture: false },
          { coordinatesKey: "1-4", occupied: false, canCapture: false },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(possibleMoves).toEqual(["1-2"]);
    });

    it("should filter trajectories independently on two axes", () => {
      const from = new Coordinates(1, 1);
      const vertical = new Direction({ deltaX: 0, deltaY: 1, maxRange: 8 });
      const horizontal = new Direction({ deltaX: 1, deltaY: 0, maxRange: 8 });

      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: jest.fn().mockImplementation(({ direction }) => {
          if (vertical === direction) {
            return [new Coordinates(1, 2), new Coordinates(1, 3), new Coordinates(1, 4)];
          }

          return [new Coordinates(2, 1), new Coordinates(3, 1), new Coordinates(4, 1)];
        }),
      };

      const figure = {
        getColor: () => FigureColor.WHITE,
        getDirections: () => [vertical, horizontal],
        hasMoved: () => false,
      } as unknown as Figure;

      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-1", occupied: false, canCapture: false },
          { coordinatesKey: "1-2", occupied: false, canCapture: false },
          { coordinatesKey: "1-3", occupied: true, canCapture: false },
          { coordinatesKey: "1-4", occupied: false, canCapture: false },
          { coordinatesKey: "2-1", occupied: false, canCapture: false },
          { coordinatesKey: "3-1", occupied: true, canCapture: true },
          { coordinatesKey: "4-1", occupied: false, canCapture: false },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(possibleMoves).toEqual(["1-2", "2-1", "3-1"]);
    });

    it.each([
      {
        name: "should return one if there is near one enemy on the trajectory",
        trajectory: [new Coordinates(2, 2)],
        fieldsState: [
          { coordinatesKey: "1-1", occupied: true, canCapture: false },
          { coordinatesKey: "2-2", occupied: true, canCapture: true },
        ],
        expected: ["2-2"],
      },
      {
        name: "should return one if there are two enemies on the trajectory",
        trajectory: [new Coordinates(2, 2), new Coordinates(3, 3)],
        fieldsState: [
          { coordinatesKey: "1-1", occupied: true, canCapture: false },
          { coordinatesKey: "2-2", occupied: true, canCapture: true },
          { coordinatesKey: "3-3", occupied: true, canCapture: true },
        ],
        expected: ["2-2"],
      },
      {
        name: "should return empty when there is one enemy after empty space on the trajectory",
        trajectory: [new Coordinates(2, 2), new Coordinates(3, 3)],
        fieldsState: [
          { coordinatesKey: "1-1", occupied: true, canCapture: false },
          { coordinatesKey: "2-2", occupied: false, canCapture: false },
          { coordinatesKey: "3-3", occupied: true, canCapture: true },
        ],
        expected: [],
      },
    ])("should reach only the first capturable enemy when $name", ({ trajectory, fieldsState, expected }) => {
      const from = new Coordinates(1, 1);
      const captureDirection = new Direction({
        deltaX: 1,
        deltaY: 1,
        maxRange: 3,
        whenEnemy: true,
      });
      const forVectorMovementOnExistingFields = jest.fn().mockReturnValue(trajectory);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: forVectorMovementOnExistingFields,
      };
      const figure = {
        getColor: () => FigureColor.WHITE,
        hasMoved: () => false,
        getDirections: () => [captureDirection],
      } as unknown as Figure;
      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue(fieldsState),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).toHaveBeenCalled();
      expect(possibleMoves).toEqual(expected);
    });

    it("should stop whenEnemy trajectory when field is not capturable", () => {
      const from = new Coordinates(1, 1);
      const captureDirection = new Direction({
        deltaX: 1,
        deltaY: 1,
        maxRange: 1,
        whenEnemy: true,
      });
      const forVectorMovementOnExistingFields = jest.fn().mockReturnValue([new Coordinates(2, 2)]);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: forVectorMovementOnExistingFields,
      };
      const figure = {
        getColor: () => FigureColor.WHITE,
        hasMoved: () => false,
        getDirections: () => [captureDirection],
      } as unknown as Figure;
      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-1", occupied: true, canCapture: false },
          { coordinatesKey: "2-2", occupied: false, canCapture: false },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).toHaveBeenCalled();
      expect(possibleMoves).toEqual([]);
    });

    it("should include whenStartingPosition direction when figure has not moved", () => {
      const from = new Coordinates(1, 2);
      const startingDirection = new Direction({
        deltaX: 0,
        deltaY: 1,
        maxRange: 2,
        whenStartingPosition: true,
      });
      const forVectorMovementOnExistingFields = jest
        .fn()
        .mockReturnValue([new Coordinates(1, 3), new Coordinates(1, 4)]);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: forVectorMovementOnExistingFields,
      };
      const figure = {
        getColor: () => FigureColor.WHITE,
        hasMoved: () => false,
        getDirections: () => [startingDirection],
      } as unknown as Figure;
      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFigureByCoordinates: jest.fn(),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-2", occupied: false, canCapture: false },
          { coordinatesKey: "1-3", occupied: false, canCapture: false },
          { coordinatesKey: "1-4", occupied: false, canCapture: false },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).toHaveBeenCalled();
      expect(possibleMoves).toEqual(["1-3", "1-4"]);
    });

    it("should skip whenStartingPosition direction when figure has already moved", () => {
      const from = new Coordinates(1, 2);
      const startingDirection = new Direction({
        deltaX: 0,
        deltaY: 1,
        maxRange: 2,
        whenStartingPosition: true,
      });
      const forVectorMovementOnExistingFields = jest
        .fn()
        .mockReturnValue([new Coordinates(1, 3), new Coordinates(1, 4)]);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: forVectorMovementOnExistingFields,
      };
      const figure = {
        getColor: () => FigureColor.WHITE,
        hasMoved: () => true,
        getDirections: () => [startingDirection],
      } as unknown as Figure;
      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFigureByCoordinates: jest.fn(),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-2", occupied: false, canCapture: false },
          { coordinatesKey: "1-3", occupied: false, canCapture: false },
          { coordinatesKey: "1-4", occupied: false, canCapture: false },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).not.toHaveBeenCalled();
      expect(possibleMoves).toEqual([]);
    });

    it("should return empty list when trajectory is empty", () => {
      const from = new Coordinates(1, 1);
      const forVectorMovementOnExistingFields = jest.fn().mockReturnValue([]);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: forVectorMovementOnExistingFields,
      };
      const figure = {
        getColor: () => FigureColor.WHITE,
        hasMoved: () => false,
        getDirections: () => [new Direction({ deltaX: 0, deltaY: 1, maxRange: 1 })],
      } as unknown as Figure;
      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue([{ coordinatesKey: "1-1", occupied: true, canCapture: false }]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).toHaveBeenCalled();
      expect(possibleMoves).toEqual([]);
    });

    it("should not capture when direction.canCapture is false", () => {
      const from = new Coordinates(1, 1);
      const forwardWithoutCapture = new Direction({
        deltaX: 0,
        deltaY: 1,
        maxRange: 1,
        canCapture: false,
      });
      const forVectorMovementOnExistingFields = jest.fn().mockReturnValue([new Coordinates(1, 2)]);
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: forVectorMovementOnExistingFields,
      };
      const figure = {
        getColor: () => FigureColor.WHITE,
        hasMoved: () => false,
        getDirections: () => [forwardWithoutCapture],
      } as unknown as Figure;
      const board = {
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
        getFieldsState: jest.fn().mockReturnValue([
          { coordinatesKey: "1-1", occupied: true, canCapture: false },
          { coordinatesKey: "1-2", occupied: true, canCapture: true },
        ]),
      } as unknown as Board;

      const moveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).toHaveBeenCalled();
      expect(possibleMoves).toEqual([]);
    });
  });

  describe("createValidatedMoveContextOrNull", () => {
    const from = new Coordinates(5, 1);
    const to = new Coordinates(7, 1);
    const movement = new Movement(from, to);
    const step = new Direction({ deltaX: 1, deltaY: 0 });
    const castlingStep = new Direction({ deltaX: 1, deltaY: 0, castling: true });

    const pathGenerator = (path: Coordinates[] = []): PathGenerator => ({
      forVectorMovementWithoutTarget: jest.fn().mockReturnValue(path),
      forDirectionOnExistingFields: jest.fn(),
    });

    const figure = (overrides: Partial<Figure> = {}): Figure =>
      ({
        isFriendly: () => false,
        hasMoved: () => false,
        getDirections: () => [step],
        getName: () => FigureName.KING,
        ...overrides,
      }) as unknown as Figure;

    const board = (movingFigure: Figure, overrides: Partial<Board> = {}): Board =>
      ({
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(movingFigure),
        getFigureByCoordinates: jest.fn().mockReturnValue(null),
        anyFigureOnCoordinates: jest.fn().mockReturnValue(false),
        ...overrides,
      }) as unknown as Board;

    it("returns a quiet move context when the path is free", () => {
      const movingFigure = figure();
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      const context = analyzer.createValidatedMoveContextOrNull(board(movingFigure), movement);

      expect(context).toEqual({ movement, capturing: false });
    });

    it("returns a capturing context when the target is an enemy", () => {
      const movingFigure = figure();
      const targetFigure = figure();
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      const context = analyzer.createValidatedMoveContextOrNull(
        board(movingFigure, {
          getFigureByCoordinates: jest.fn().mockReturnValue(targetFigure),
        }),
        movement,
      );

      expect(context).toEqual({ movement, capturing: true });
    });

    it("returns a castling context with the partner movement", () => {
      const rook = figure({
        getName: () => FigureName.ROOK,
        isFriendly: () => true,
        hasMoved: () => false,
      });
      const movingFigure = figure({
        getDirections: () => [castlingStep],
        isFriendly: (other) => other === rook,
      });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());
      const expectedCastlingable = to.addVector(castlingStep);

      const context = analyzer.createValidatedMoveContextOrNull(
        board(movingFigure, {
          getFigureByCoordinatesOrThrow: jest.fn((coordinates: Coordinates) =>
            coordinates.equals(from) ? movingFigure : rook,
          ),
        }),
        movement,
      );

      expect(context).toEqual({
        movement,
        capturing: false,
        castlingMovement: new Movement(expectedCastlingable, to.subtractVector(castlingStep)),
      });
    });

    it("throws FigureInvalidMove when the target is friendly", () => {
      const movingFigure = figure({ isFriendly: () => true });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      expect(() =>
        analyzer.createValidatedMoveContextOrNull(
          board(movingFigure, {
            getFigureByCoordinates: jest.fn().mockReturnValue(figure()),
          }),
          movement,
        ),
      ).toThrow(FigureInvalidMove);
    });

    it("returns null when capturing with a direction that cannot capture", () => {
      const movingFigure = figure({
        getDirections: () => [new Direction({ deltaX: 1, deltaY: 0, canCapture: false })],
      });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      const context = analyzer.createValidatedMoveContextOrNull(
        board(movingFigure, {
          getFigureByCoordinates: jest.fn().mockReturnValue(figure()),
        }),
        movement,
      );

      expect(context).toBeNull();
    });

    it("returns null when a starting-position direction is used after the figure has moved", () => {
      const movingFigure = figure({
        hasMoved: () => true,
        getDirections: () => [new Direction({ deltaX: 1, deltaY: 0, whenStartingPosition: true })],
      });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      const context = analyzer.createValidatedMoveContextOrNull(board(movingFigure), movement);

      expect(context).toBeNull();
    });

    it("allows a starting-position direction when the figure has not moved", () => {
      const movingFigure = figure({
        hasMoved: () => false,
        getDirections: () => [new Direction({ deltaX: 1, deltaY: 0, whenStartingPosition: true })],
      });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      const context = analyzer.createValidatedMoveContextOrNull(board(movingFigure), movement);

      expect(context).toEqual({ movement, capturing: false });
    });

    it("returns null when no direction matches the movement", () => {
      const movingFigure = figure({
        getDirections: () => [new Direction({ deltaX: 0, deltaY: 1 })],
      });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      const context = analyzer.createValidatedMoveContextOrNull(board(movingFigure), movement);

      expect(context).toBeNull();
    });

    it("throws FigureInvalidMove when castling and capturing at the same time", () => {
      const movingFigure = figure({ getDirections: () => [castlingStep] });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      expect(() =>
        analyzer.createValidatedMoveContextOrNull(
          board(movingFigure, {
            getFigureByCoordinates: jest.fn().mockReturnValue(figure()),
          }),
          movement,
        ),
      ).toThrow(FigureInvalidMove);
    });

    it("throws FigureMoveCollision when a figure stands on the path", () => {
      const movingFigure = figure();
      const analyzer = new ChessMoveAnalyzer(pathGenerator([new Coordinates(6, 1)]));

      expect(() =>
        analyzer.createValidatedMoveContextOrNull(
          board(movingFigure, {
            anyFigureOnCoordinates: jest.fn().mockReturnValue(true),
          }),
          movement,
        ),
      ).toThrow(FigureMoveCollision);
    });

    it("throws FigureInvalidMove when the castling partner is not a rook", () => {
      const movingFigure = figure({ getDirections: () => [castlingStep] });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      expect(() =>
        analyzer.createValidatedMoveContextOrNull(
          board(movingFigure, {
            getFigureByCoordinatesOrThrow: jest.fn((coordinates: Coordinates) =>
              coordinates.equals(from) ? movingFigure : figure({ getName: () => FigureName.BISHOP }),
            ),
          }),
          movement,
        ),
      ).toThrow(FigureInvalidMove);
    });

    it("throws FigureInvalidMove when the castling partner is not friendly", () => {
      const movingFigure = figure({ getDirections: () => [castlingStep] });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      expect(() =>
        analyzer.createValidatedMoveContextOrNull(
          board(movingFigure, {
            getFigureByCoordinatesOrThrow: jest.fn((coordinates: Coordinates) =>
              coordinates.equals(from)
                ? movingFigure
                : figure({ getName: () => FigureName.ROOK, isFriendly: () => true }),
            ),
          }),
          movement,
        ),
      ).toThrow(FigureInvalidMove);
    });

    it("throws FigureInvalidMove when the castling partner has already moved", () => {
      const rook = figure({
        getName: () => FigureName.ROOK,
        hasMoved: () => true,
      });
      const movingFigure = figure({
        getDirections: () => [castlingStep],
        isFriendly: (other) => other === rook,
      });
      const analyzer = new ChessMoveAnalyzer(pathGenerator());

      expect(() =>
        analyzer.createValidatedMoveContextOrNull(
          board(movingFigure, {
            getFigureByCoordinatesOrThrow: jest.fn((coordinates: Coordinates) =>
              coordinates.equals(from) ? movingFigure : rook,
            ),
          }),
          movement,
        ),
      ).toThrow(FigureInvalidMove);
    });
  });

  describe("createValidatedMoveContextOrThrow", () => {
    const movement = new Movement(new Coordinates(5, 1), new Coordinates(7, 1));
    const board = {} as Board;
    const analyzer = new ChessMoveAnalyzer({
      forVectorMovementWithoutTarget: jest.fn(),
      forDirectionOnExistingFields: jest.fn(),
    });

    it("returns the context when createValidatedMoveContextOrNull returns one", () => {
      const context: ValidatedMoveContext = { movement, capturing: false };
      jest.spyOn(analyzer, "createValidatedMoveContextOrNull").mockReturnValue(context);

      const result = analyzer.createValidatedMoveContextOrThrow(board, movement);

      expect(result).toBe(context);
    });

    it("throws FigureInvalidMove when createValidatedMoveContextOrNull returns null", () => {
      jest.spyOn(analyzer, "createValidatedMoveContextOrNull").mockReturnValue(null);

      expect(() => analyzer.createValidatedMoveContextOrThrow(board, movement)).toThrow(FigureInvalidMove);
    });
  });
});
