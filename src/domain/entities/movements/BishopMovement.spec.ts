import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { BishopMovement } from "./BishopMovement";

describe("BishopMovement", () => {
  const bishop = new BishopMovement();
  const from = new Coordinates(24, 24);

  it("allows a move when the position changes by the same integer on X and Y", () => {
    expect(bishop.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
      true,
    );
    expect(bishop.canMove(new Movement(from, new Coordinates(21, 21)))).toBe(
      true,
    );
    expect(bishop.canMove(new Movement(from, new Coordinates(27, 21)))).toBe(
      true,
    );
  });

  it("rejects a move when the X and Y deltas are not equal", () => {
    expect(bishop.canMove(new Movement(from, new Coordinates(27, 26)))).toBe(
      false,
    );
    expect(bishop.canMove(new Movement(from, new Coordinates(24, 27)))).toBe(
      false,
    );
    expect(bishop.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
      false,
    );
  });

  describe("domain directions", () => {
    it("allows move up-right", () => {
      expect(bishop.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
        true,
      );
    });

    it("allows move up-left", () => {
      expect(bishop.canMove(new Movement(from, new Coordinates(21, 27)))).toBe(
        true,
      );
    });

    it("allows move down-right", () => {
      expect(bishop.canMove(new Movement(from, new Coordinates(27, 21)))).toBe(
        true,
      );
    });

    it("allows move down-left", () => {
      expect(bishop.canMove(new Movement(from, new Coordinates(21, 21)))).toBe(
        true,
      );
    });
  });
});
