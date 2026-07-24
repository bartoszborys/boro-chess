import { Coordinates } from "@/domain/entities/Coordinates";
import { Movement } from "@/domain/entities/Movement";
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
    });
  });
});
