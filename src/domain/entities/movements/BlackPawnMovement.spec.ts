import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { FigureInvalidMove } from "@/domain/exceptions/FigureCannotMove";
import { Direction } from "@/domain/value-objects/Direction";
import { BlackPawnMovement } from "./BlackPawnMovement";

interface Delta {
  x: number;
  y: number;
}

function addDeltaToCoordinates(
  delta: Delta,
  coordinates: Coordinates,
): Coordinates {
  return new Coordinates(coordinates.x + delta.x, coordinates.y + delta.y);
}

function cloneCoordinates(coordinates: Coordinates): Coordinates {
  return new Coordinates(coordinates.x, coordinates.y);
}

describe("BlackPawnMovement", () => {
  const startingPosition = new Coordinates(24, 22);
  const blackPawn = new BlackPawnMovement(startingPosition);
  const fromAdvancedPosition = new Coordinates(24, 25);

  describe("canMove", () => {
    it("rejects a sideways move to the right", () => {
      expect(
        blackPawn.canMove(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 1, y: 0 }, fromAdvancedPosition),
          ),
        ),
      ).toBe(false);
    });

    it("rejects a sideways move to the left", () => {
      expect(
        blackPawn.canMove(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: -1, y: 0 }, fromAdvancedPosition),
          ),
        ),
      ).toBe(false);
    });

    it("rejects a backward move", () => {
      expect(
        blackPawn.canMove(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 0, y: 1 }, fromAdvancedPosition),
          ),
        ),
      ).toBe(false);
    });

    it("rejects a move forward by two when not on the starting position", () => {
      expect(
        blackPawn.canMove(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 0, y: -2 }, fromAdvancedPosition),
          ),
        ),
      ).toBe(false);
    });

    describe("domain directions", () => {
      describe("non capturing", () => {
        it("allows a move forward by one", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                fromAdvancedPosition,
                addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition),
              ),
            ),
          ).toBe(true);
        });

        it("allows move forward by two from the starting position", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                cloneCoordinates(startingPosition),
                addDeltaToCoordinates({ x: 0, y: -2 }, startingPosition),
              ),
            ),
          ).toBe(true);
        });
      });

      describe("capturing", () => {
        it("rejects capture straight forward", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                fromAdvancedPosition,
                addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition),
                true,
              ),
            ),
          ).toBe(false);
        });

        it("allows capture down-right", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                fromAdvancedPosition,
                addDeltaToCoordinates({ x: 1, y: -1 }, fromAdvancedPosition),
                true,
              ),
            ),
          ).toBe(true);
        });

        it("allows capture down-left", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                fromAdvancedPosition,
                addDeltaToCoordinates({ x: -1, y: -1 }, fromAdvancedPosition),
                true,
              ),
            ),
          ).toBe(true);
        });

        it("rejects capture by two diagonally from the starting position", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                startingPosition,
                addDeltaToCoordinates({ x: 1, y: -2 }, startingPosition),
                true,
              ),
            ),
          ).toBe(false);
        });

        it("rejects capture up-right", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                fromAdvancedPosition,
                addDeltaToCoordinates({ x: 1, y: 1 }, fromAdvancedPosition),
                true,
              ),
            ),
          ).toBe(false);
        });

        it("rejects capture up-left", () => {
          expect(
            blackPawn.canMove(
              new Movement(
                fromAdvancedPosition,
                addDeltaToCoordinates({ x: -1, y: 1 }, fromAdvancedPosition),
                true,
              ),
            ),
          ).toBe(false);
        });
      });
    });
  });

  describe("getCollisionCoordinates", () => {
    it("returns the destination for a one-step forward move", () => {
      expect(
        blackPawn.getCollisionCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition),
          ),
        ),
      ).toEqual([
        addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition),
      ]);
    });

    it("returns the in-between square and destination for a two-step forward move", () => {
      expect(
        blackPawn.getCollisionCoordinates(
          new Movement(
            startingPosition,
            addDeltaToCoordinates({ x: 0, y: -2 }, startingPosition),
          ),
        ),
      ).toEqual([
        addDeltaToCoordinates({ x: 0, y: -1 }, startingPosition),
        addDeltaToCoordinates({ x: 0, y: -2 }, startingPosition),
      ]);
    });

    it("returns no collision coordinates when capturing down-right", () => {
      expect(
        blackPawn.getCollisionCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: 1, y: -1 }, fromAdvancedPosition),
            true,
          ),
        ),
      ).toEqual([]);
    });

    it("returns no collision coordinates when capturing down-left", () => {
      expect(
        blackPawn.getCollisionCoordinates(
          new Movement(
            fromAdvancedPosition,
            addDeltaToCoordinates({ x: -1, y: -1 }, fromAdvancedPosition),
            true,
          ),
        ),
      ).toEqual([]);
    });

    it("throws FigureInvalidMove when the forward move is larger than two steps", () => {
      expect(() =>
        blackPawn.getCollisionCoordinates(
          new Movement(
            startingPosition,
            addDeltaToCoordinates({ x: 0, y: -3 }, startingPosition),
          ),
        ),
      ).toThrow(FigureInvalidMove);
    });
  });

  describe("getDirections", () => {
    it("returns all possible directions including double-step from start", () => {
      const directions = blackPawn.getDirections();

      expect(directions).toHaveLength(4);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({
            deltaX: 0,
            deltaY: -1,
            canCapture: false,
            whenEnemy: false,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 0,
            deltaY: -1,
            canCapture: false,
            whenEnemy: false,
            maxRange: 2,
            whenStartingPosition: true,
          }),
          new Direction({
            deltaX: -1,
            deltaY: -1,
            canCapture: true,
            whenEnemy: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: -1,
            canCapture: true,
            whenEnemy: true,
            maxRange: 1,
          }),
        ]),
      );
    });
  });
});
