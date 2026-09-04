import { ChessGameRules } from "@/domain/services/GameRules";
import type { KingCheck } from "@/domain/services/KingCheck";
import type { PromotionRule } from "@/domain/entities/rules/PromotionRule";
import type { Player } from "@/domain/entities/Player";
import { FigureColor, FigureName } from "@/domain/enums";
import type { BoardFigureState } from "@/domain/dtos";
import { KingNotFound } from "@/domain/exceptions";
import { Coordinates } from "@/domain/value-objects/Coordinates";

describe("ChessGameRules", () => {
  const unusedKingCheck: KingCheck = {
    isKingInCheck: jest.fn(),
  };

  describe("promotionAvailable", () => {
    const promotableCoordinates = new Coordinates(1, 8);
    const promotionRule: PromotionRule = {
      isPromotable: (_name, _color, coordinate) => coordinate.equals(promotableCoordinates),
    };
    const rules = new ChessGameRules(unusedKingCheck, [promotionRule]);

    const figureAt = (coordinates: Coordinates): BoardFigureState => ({
      coordinates,
      name: FigureName.PAWN,
      color: FigureColor.WHITE,
      isCaptured: false,
    });

    it("is true when any figure matches a promotion rule", () => {
      const boardState = {
        figuresState: [figureAt(new Coordinates(2, 2)), figureAt(promotableCoordinates)],
        fieldsState: [],
      };

      const available = rules.promotionAvailable(boardState);

      expect(available).toBe(true);
    });

    it("is false when no figure matches a promotion rule", () => {
      const boardState = {
        figuresState: [figureAt(new Coordinates(2, 2))],
        fieldsState: [],
      };

      const available = rules.promotionAvailable(boardState);

      expect(available).toBe(false);
    });

    it("is false when there are no figures on the board", () => {
      const boardState = {
        figuresState: [],
        fieldsState: [],
      };

      const available = rules.promotionAvailable(boardState);

      expect(available).toBe(false);
    });
  });

  describe("boardValidStateForPlayer", () => {
    const movingPlayerColor = FigureColor.WHITE;
    const playerKing: BoardFigureState = {
      coordinates: new Coordinates(1, 1),
      name: FigureName.KING,
      color: FigureColor.WHITE,
      isCaptured: false,
    };
    const boardState = {
      figuresState: [playerKing],
      fieldsState: [],
    };

    const rulesWith = ({ inCheck }: { inCheck: boolean }) =>
      new ChessGameRules({ isKingInCheck: jest.fn().mockReturnValue(inCheck) }, []);

    it("is valid when the player's king is not left in check", () => {
      const valid = rulesWith({ inCheck: false }).boardValidStateForPlayer(boardState, movingPlayerColor);

      expect(valid).toBe(true);
    });

    it("is invalid when the move leaves the player's king in check", () => {
      const valid = rulesWith({ inCheck: true }).boardValidStateForPlayer(boardState, movingPlayerColor);

      expect(valid).toBe(false);
    });

    it("throws KingNotFound when the player's king is missing", () => {
      const kingCheck = { isKingInCheck: jest.fn() };
      const rules = new ChessGameRules(kingCheck, []);

      expect(() =>
        rules.boardValidStateForPlayer({ figuresState: [], fieldsState: [] }, movingPlayerColor),
      ).toThrow(KingNotFound);
      expect(kingCheck.isKingInCheck).not.toHaveBeenCalled();
    });
  });

  describe("checkGameEndState", () => {
    const lastMovedPlayer = {
      getEnemyColor: () => FigureColor.BLACK,
    } as unknown as Player;
    const enemyKing: BoardFigureState = {
      coordinates: new Coordinates(1, 1),
      name: FigureName.KING,
      color: FigureColor.BLACK,
      isCaptured: false,
    };
    const boardState = {
      figuresState: [enemyKing],
      fieldsState: [],
    };

    const rulesWith = ({ inCheck }: { inCheck: boolean }) =>
      new ChessGameRules({ isKingInCheck: jest.fn().mockReturnValue(inCheck) }, []);

    it("is a win for the last moved player when the enemy king is in check", () => {
      const result = rulesWith({ inCheck: true }).checkGameEndState(boardState, lastMovedPlayer);

      expect(result).toEqual({
        win: true,
        draw: false,
        winner: lastMovedPlayer,
      });
    });

    it("is a draw when the enemy king is not in check", () => {
      const result = rulesWith({ inCheck: false }).checkGameEndState(boardState, lastMovedPlayer);

      expect(result).toEqual({
        win: false,
        draw: true,
        winner: null,
      });
    });

    it("throws KingNotFound when the enemy king is missing", () => {
      const kingCheck = { isKingInCheck: jest.fn() };
      const rules = new ChessGameRules(kingCheck, []);

      expect(() =>
        rules.checkGameEndState({ figuresState: [], fieldsState: [] }, lastMovedPlayer),
      ).toThrow(KingNotFound);
      expect(kingCheck.isKingInCheck).not.toHaveBeenCalled();
    });
  });
});
