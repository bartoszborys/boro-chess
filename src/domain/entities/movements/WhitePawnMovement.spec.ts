import { Coordinates } from "@/domain/entities/Coordinates";
import { Movement } from "@/domain/entities/Movement";
import { WhitePawnMovement } from "./WhitePawnMovement";

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

describe("WhitePawnMovement", () => {
  const startingPosition = new Coordinates(24, 22);
  const whitePawn = new WhitePawnMovement(startingPosition);
  const fromAdvancedPosition = new Coordinates(24, 25);

  it("rejects a sideways move to the right", () => {
    expect(
      whitePawn.canMove(
        new Movement(
          fromAdvancedPosition,
          addDeltaToCoordinates({ x: 1, y: 0 }, fromAdvancedPosition),
        ),
      ),
    ).toBe(false);
  });

  it("rejects a sideways move to the left", () => {
    expect(
      whitePawn.canMove(
        new Movement(
          fromAdvancedPosition,
          addDeltaToCoordinates({ x: -1, y: 0 }, fromAdvancedPosition),
        ),
      ),
    ).toBe(false);
  });

  it("rejects a backward move", () => {
    expect(
      whitePawn.canMove(
        new Movement(
          fromAdvancedPosition,
          addDeltaToCoordinates({ x: 0, y: -1 }, fromAdvancedPosition),
        ),
      ),
    ).toBe(false);
  });

  it("rejects a move forward by two when not on the starting position", () => {
    expect(
      whitePawn.canMove(
        new Movement(
          fromAdvancedPosition,
          addDeltaToCoordinates({ x: 0, y: 2 }, fromAdvancedPosition),
        ),
      ),
    ).toBe(false);
  });

  describe("domain directions", () => {
    describe("non capturing", () => {
      it("allows a move forward by one", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              fromAdvancedPosition,
              addDeltaToCoordinates({ x: 0, y: 1 }, fromAdvancedPosition),
            ),
          ),
        ).toBe(true);
      });

      it("allows move forward by two from the starting position", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              cloneCoordinates(startingPosition),
              addDeltaToCoordinates({ x: 0, y: 2 }, startingPosition),
            ),
          ),
        ).toBe(true);
      });
    });

    describe("capturing", () => {
      it("rejects capture straight forward", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              fromAdvancedPosition,
              addDeltaToCoordinates({ x: 0, y: 1 }, fromAdvancedPosition),
              true,
            ),
          ),
        ).toBe(false);
      });

      it("allows capture up-right", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              fromAdvancedPosition,
              addDeltaToCoordinates({ x: 1, y: 1 }, fromAdvancedPosition),
              true,
            ),
          ),
        ).toBe(true);
      });

      it("allows capture up-left", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              fromAdvancedPosition,
              addDeltaToCoordinates({ x: -1, y: 1 }, fromAdvancedPosition),
              true,
            ),
          ),
        ).toBe(true);
      });

      it("rejects capture by two diagonally from the starting position", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              startingPosition,
              addDeltaToCoordinates({ x: 1, y: 2 }, startingPosition),
              true,
            ),
          ),
        ).toBe(false);
      });

      it("rejects capture down-right", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              fromAdvancedPosition,
              addDeltaToCoordinates({ x: 1, y: -1 }, fromAdvancedPosition),
              true,
            ),
          ),
        ).toBe(false);
      });

      it("rejects capture down-left", () => {
        expect(
          whitePawn.canMove(
            new Movement(
              fromAdvancedPosition,
              addDeltaToCoordinates({ x: -1, y: -1 }, fromAdvancedPosition),
              true,
            ),
          ),
        ).toBe(false);
      });
    });
  });
});
