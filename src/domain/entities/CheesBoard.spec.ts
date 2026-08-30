import { FieldsBoard } from "@/domain/entities/CheesBoard";
import { CheesFigure, type Figure } from "@/domain/entities/CheesFigure";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
import { FigureColor } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { BoardField } from "@/domain/dtos";
import { Movement } from "@/domain/value-objects/Movement";

describe("FieldsBoard", () => {
  describe("getFieldsState", () => {
    it("Should map fields to state with empty occupancy, capturable figure and coordinates key", () => {
      const emptyCoordinates = new Coordinates(1, 1);
      const enemyCoordinates = new Coordinates(2, 3);
      const friendlyCoordinates = new Coordinates(3, 4);

      const fields: Record<string, BoardField> = {
        [emptyCoordinates.toKey()]: {
          coordinates: emptyCoordinates,
          figure: null,
        },
        [enemyCoordinates.toKey()]: {
          coordinates: enemyCoordinates,
          figure: new CheesFigure(FigureColor.BLACK, new WhitePawnBehavior()),
        },
        [friendlyCoordinates.toKey()]: {
          coordinates: friendlyCoordinates,
          figure: new CheesFigure(FigureColor.WHITE, new WhitePawnBehavior()),
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
        ]),
      );
      expect(state).toHaveLength(3);
    });
  });

  describe("moveFigure", () => {
    it("Should move the figure to the destination, mark it as moved and leave the source field empty", () => {
      const from = new Coordinates(1, 2);
      const to = new Coordinates(1, 3);
      const figure = {
        markAsMoved: jest.fn(),
      } as unknown as Figure;

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
  });
});
