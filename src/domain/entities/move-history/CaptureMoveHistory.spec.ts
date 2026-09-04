import type { Board } from "@/domain/entities/ChessBoard";
import type { Figure } from "@/domain/entities/ChessFigure";
import { CaptureMoveHistory } from "@/domain/entities/move-history/CaptureMoveHistory";
import { Coordinates } from "@/domain/value-objects/Coordinates";

const mockFigure = (overrides: Partial<Figure> = {}): Figure =>
  ({
    markAsMoved: jest.fn(),
    ...overrides,
  }) as unknown as Figure;

describe("CaptureMoveHistory", () => {
  describe("undo", () => {
    it("restores the captured figure on the given coordinates", () => {
      const coordinates = new Coordinates(4, 4);
      const capturedFigure = mockFigure();
      const added: Array<{ figure: Figure; coordinates: Coordinates }> = [];
      const board = {
        addFigure: (figure: Figure, at: Coordinates) => {
          added.push({ figure, coordinates: at });
        },
      } as unknown as Board;

      new CaptureMoveHistory(capturedFigure, coordinates).undo(board);

      expect(added).toEqual([{ figure: capturedFigure, coordinates }]);
    });
  });
});
