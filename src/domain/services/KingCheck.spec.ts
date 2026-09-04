import { ChessKingCheck } from "@/domain/services/KingCheck";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import type { ChessCheckRule } from "@/domain/entities/rules/CheckRule";
import { FigureColor, FigureName } from "@/domain/enums";
import type { BoardFigureState } from "@/domain/dtos";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";

describe("ChessKingCheck", () => {
  describe("isKingInCheck", () => {
    const kingCoordinates = new Coordinates(1, 1);
    const attackerCoordinates = new Coordinates(3, 1);
    const king: BoardFigureState = {
      coordinates: kingCoordinates,
      name: FigureName.KING,
      color: FigureColor.WHITE,
      isCaptured: false,
    };
    const attacker: BoardFigureState = {
      coordinates: attackerCoordinates,
      name: FigureName.ROOK,
      color: FigureColor.BLACK,
      isCaptured: false,
    };

    const checkRule: ChessCheckRule = {
      canApplyToColor: () => true,
      getDirections: () => [new Direction({ deltaX: 1, deltaY: 0, canCapture: true })],
      handlesFigure: (name) => name === FigureName.ROOK,
    };

    const kingCheckWith = ({
      path,
      rules = [checkRule],
    }: {
      path: Coordinates[];
      rules?: ChessCheckRule[];
    }) => {
      const pathGenerator: PathGenerator = {
        forVectorMovementWithoutTarget: jest.fn(),
        forDirectionOnExistingFields: jest.fn().mockReturnValue(path),
      };

      return new ChessKingCheck(pathGenerator, rules);
    };

    it("is true when an enemy figure on the path can check the king", () => {
      const between = new Coordinates(2, 1);
      const kingCheck = kingCheckWith({ path: [between, attackerCoordinates] });
      const boardState = {
        figuresState: [king, attacker],
        fieldsState: [
          { coordinatesKey: kingCoordinates.toKey(), occupied: true, canCapture: false },
          { coordinatesKey: between.toKey(), occupied: false, canCapture: false },
          { coordinatesKey: attackerCoordinates.toKey(), occupied: true, canCapture: true },
        ],
      };

      const inCheck = kingCheck.isKingInCheck(boardState, FigureColor.WHITE, king);

      expect(inCheck).toBe(true);
    });

    it("is false when no figure stands on the path", () => {
      const kingCheck = kingCheckWith({ path: [] });
      const boardState = {
        figuresState: [king, attacker],
        fieldsState: [],
      };

      const inCheck = kingCheck.isKingInCheck(boardState, FigureColor.WHITE, king);

      expect(inCheck).toBe(false);
    });

    it("is false when the figure on the path is friendly", () => {
      const friendly: BoardFigureState = {
        ...attacker,
        color: FigureColor.WHITE,
      };
      const kingCheck = kingCheckWith({ path: [friendly.coordinates] });
      const boardState = {
        figuresState: [king, friendly],
        fieldsState: [],
      };

      const inCheck = kingCheck.isKingInCheck(boardState, FigureColor.WHITE, king);

      expect(inCheck).toBe(false);
    });

    it("is false when the check rule does not handle the figure", () => {
      const kingCheck = kingCheckWith({
        path: [attackerCoordinates],
        rules: [{ ...checkRule, handlesFigure: () => false }],
      });
      const boardState = {
        figuresState: [king, attacker],
        fieldsState: [],
      };

      const inCheck = kingCheck.isKingInCheck(boardState, FigureColor.WHITE, king);

      expect(inCheck).toBe(false);
    });

    it("skips a rule that cannot apply to the king's color", () => {
      const kingCheck = kingCheckWith({
        path: [attackerCoordinates],
        rules: [{ ...checkRule, canApplyToColor: () => false }],
      });
      const boardState = {
        figuresState: [king, attacker],
        fieldsState: [],
      };

      const inCheck = kingCheck.isKingInCheck(boardState, FigureColor.WHITE, king);

      expect(inCheck).toBe(false);
    });

    it("skips a direction that cannot capture and is not castling", () => {
      const kingCheck = kingCheckWith({
        path: [attackerCoordinates],
        rules: [
          {
            ...checkRule,
            getDirections: () => [new Direction({ deltaX: 1, deltaY: 0, canCapture: false, castling: false })],
          },
        ],
      });
      const boardState = {
        figuresState: [king, attacker],
        fieldsState: [],
      };

      const inCheck = kingCheck.isKingInCheck(boardState, FigureColor.WHITE, king);

      expect(inCheck).toBe(false);
    });
  });
});
