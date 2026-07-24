import { Coordinates } from "@/domain/entities/Coordinates";
import { Movement } from "@/domain/entities/Movement";
import { KingMovement } from "./KingMovement";

describe("KingMovement", () => {
  const king = new KingMovement();
  const from = new Coordinates(24, 24);

  it("allows a move of one in any direction", () => {
    expect(king.canMove(new Movement(from, new Coordinates(24, 25)))).toBe(
      true,
    );
    expect(king.canMove(new Movement(from, new Coordinates(25, 24)))).toBe(
      true,
    );
    expect(king.canMove(new Movement(from, new Coordinates(25, 25)))).toBe(
      true,
    );
    expect(king.canMove(new Movement(from, new Coordinates(23, 23)))).toBe(
      true,
    );
  });

  it("rejects a move that is not exactly one in any direction", () => {
    expect(king.canMove(new Movement(from, new Coordinates(24, 26)))).toBe(
      false,
    );
    expect(king.canMove(new Movement(from, new Coordinates(26, 24)))).toBe(
      false,
    );
    expect(king.canMove(new Movement(from, new Coordinates(26, 26)))).toBe(
      false,
    );
    expect(king.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
      false,
    );
  });

  describe("domain directions", () => {
    it("allows move up", () => {
      expect(king.canMove(new Movement(from, new Coordinates(24, 25)))).toBe(
        true,
      );
    });

    it("allows move down", () => {
      expect(king.canMove(new Movement(from, new Coordinates(24, 23)))).toBe(
        true,
      );
    });

    it("allows move left", () => {
      expect(king.canMove(new Movement(from, new Coordinates(23, 24)))).toBe(
        true,
      );
    });

    it("allows move right", () => {
      expect(king.canMove(new Movement(from, new Coordinates(25, 24)))).toBe(
        true,
      );
    });

    it("allows move up-left", () => {
      expect(king.canMove(new Movement(from, new Coordinates(23, 25)))).toBe(
        true,
      );
    });

    it("allows move up-right", () => {
      expect(king.canMove(new Movement(from, new Coordinates(25, 25)))).toBe(
        true,
      );
    });

    it("allows move down-left", () => {
      expect(king.canMove(new Movement(from, new Coordinates(23, 23)))).toBe(
        true,
      );
    });

    it("allows move down-right", () => {
      expect(king.canMove(new Movement(from, new Coordinates(25, 23)))).toBe(
        true,
      );
    });
  });
});
