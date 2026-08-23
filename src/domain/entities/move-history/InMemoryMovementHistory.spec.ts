import type { Board } from "@/domain/entities/CheesBoard";
import type { Figure } from "@/domain/entities/CheesFigure";
import { InMemoryMovementHistory } from "@/domain/entities/move-history/InMemoryMovementHistory";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";

describe("InMemoryMovementHistory", () => {
  describe("undo", () => {
    const from = new Coordinates(1, 2);
    const to = new Coordinates(1, 3);
    const movement = new Movement(from, to);

    it("moves the figure back to the original coordinates", () => {
      const board = {
        moveFigure: jest.fn(),
        getFigureByCoordinatesOrThrow: jest.fn(),
      } as unknown as Board;

      new InMemoryMovementHistory(movement, true).undo(board);

      const reversedMovement = (board.moveFigure as jest.Mock).mock.calls[0][0] as Movement;
      expect(reversedMovement.from).toEqual(to);
      expect(reversedMovement.to).toEqual(from);
    });

    it.each([
      {
        name: "reverts moved when the figure had not moved before",
        hasMovedBefore: false,
        shouldMarkAsNotMoved: true,
      },
      {
        name: "leaves moved when the figure had already moved",
        hasMovedBefore: true,
        shouldMarkAsNotMoved: false,
      },
    ])("$name", ({ hasMovedBefore, shouldMarkAsNotMoved }) => {
      const figure = {
        markAsNotMoved: jest.fn(),
      } as unknown as Figure;
      const board = {
        moveFigure: jest.fn(),
        getFigureByCoordinatesOrThrow: jest.fn().mockReturnValue(figure),
      } as unknown as Board;

      new InMemoryMovementHistory(movement, hasMovedBefore).undo(board);

      if (shouldMarkAsNotMoved) {
        expect(figure.markAsNotMoved).toHaveBeenCalled();
      } else {
        expect(figure.markAsNotMoved).not.toHaveBeenCalled();
      }
    });
  });
});
