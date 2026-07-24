import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { QueenMovement } from "./QueenMovement";

describe("QueenMovement", () => {
  const queen = new QueenMovement();
  const from = new Coordinates(24, 24);

  it("allows a move when only one axis changes", () => {
    expect(queen.canMove(new Movement(from, new Coordinates(27, 24)))).toBe(
      true,
    );
    expect(queen.canMove(new Movement(from, new Coordinates(24, 21)))).toBe(
      true,
    );
  });

  it("allows a move when both axes change by the same amount", () => {
    expect(queen.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
      true,
    );
    expect(queen.canMove(new Movement(from, new Coordinates(21, 27)))).toBe(
      true,
    );
  });

  it("rejects a move that is neither orthogonal nor diagonal", () => {
    expect(queen.canMove(new Movement(from, new Coordinates(26, 25)))).toBe(
      false,
    );
    expect(queen.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
      false,
    );
  });

  describe("domain directions", () => {
    it("allows move right", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(27, 24)))).toBe(
        true,
      );
    });

    it("allows move left", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(21, 24)))).toBe(
        true,
      );
    });

    it("allows move up", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(24, 27)))).toBe(
        true,
      );
    });

    it("allows move down", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(24, 21)))).toBe(
        true,
      );
    });

    it("allows move up-right", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
        true,
      );
    });

    it("allows move up-left", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(21, 27)))).toBe(
        true,
      );
    });

    it("allows move down-right", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(27, 21)))).toBe(
        true,
      );
    });

    it("allows move down-left", () => {
      expect(queen.canMove(new Movement(from, new Coordinates(21, 21)))).toBe(
        true,
      );
    });
  });
});
