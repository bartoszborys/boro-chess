import type { Board } from "@/domain/entities/CheesBoard";
import type { Figure } from "@/domain/entities/CheesFigure";
import { CheesMoveAnalyzer } from "@/domain/services/MoveAnalyzer";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import { FigureColor } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";

describe("CheesMoveAnalyzer", () => {
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
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

      const moveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
      const possibleMoves = moveAnalyzer.createPossibleMoves(board, from);

      expect(forVectorMovementOnExistingFields).toHaveBeenCalled();
      expect(possibleMoves).toEqual([]);
    });
  });

  describe("createValidatedMoveContext", () => {});
});
