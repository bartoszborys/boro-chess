import type { PawnFactory } from "@/application/factories/FigureBehaviorFactory";
import type { Board } from "@/domain/entities/ChessBoard";
import type { Figure } from "@/domain/entities/ChessFigure";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { PromotionMoveHistory } from "@/domain/entities/move-history/PromotionMoveHistory";
import { FigureColor, FigureName } from "@/domain/enums";
import { FigureNotFound } from "@/domain/exceptions";
import { Coordinates } from "@/domain/value-objects/Coordinates";

const mockBehavior = (overrides: Partial<FigureBehavior> = {}): FigureBehavior =>
  ({
    getName: () => FigureName.PAWN,
    getDirections: () => [],
    ...overrides,
  }) as unknown as FigureBehavior;

describe("PromotionMoveHistory", () => {
  describe("undo", () => {
    it("looks up the figure, creates a pawn and promotes back", () => {
      const to = new Coordinates(1, 8);
      const pawnBehavior = mockBehavior();
      const lookedUp: Coordinates[] = [];
      const promotedWith: FigureBehavior[] = [];
      const figure = {
        getColor: () => FigureColor.WHITE,
        promote: (behavior: FigureBehavior) => {
          promotedWith.push(behavior);
        },
      } as unknown as Figure;
      const pawnFactory: PawnFactory = {
        createPawn: () => pawnBehavior,
      };
      const board = {
        getFigureByCoordinatesOrThrow: (coordinates: Coordinates) => {
          lookedUp.push(coordinates);
          return figure;
        },
      } as unknown as Board;

      new PromotionMoveHistory(to, pawnFactory).undo(board);

      expect(lookedUp).toEqual([to]);
      expect(promotedWith).toEqual([pawnBehavior]);
    });

    it("throws FigureNotFound when there is no figure on the destination", () => {
      const to = new Coordinates(1, 8);
      const pawnFactory: PawnFactory = {
        createPawn: () => mockBehavior(),
      };
      const board = {
        getFigureByCoordinatesOrThrow: () => {
          throw new FigureNotFound();
        },
      } as unknown as Board;

      expect(() => new PromotionMoveHistory(to, pawnFactory).undo(board)).toThrow(FigureNotFound);
    });
  });
});
