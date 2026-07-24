import { Coordinates } from "@/domain/entities/Coordinates";
import { Movement } from "@/domain/entities/Movement";
import { TowerMovement } from "./TowerMovement";

describe("TowerMovement", () => {
  const tower = new TowerMovement();
  const from = new Coordinates(24, 24);

  it("allows a move when only one axis changes", () => {
    expect(tower.canMove(new Movement(from, new Coordinates(27, 24)))).toBe(
      true,
    );
    expect(tower.canMove(new Movement(from, new Coordinates(24, 27)))).toBe(
      true,
    );
    expect(tower.canMove(new Movement(from, new Coordinates(21, 24)))).toBe(
      true,
    );
    expect(tower.canMove(new Movement(from, new Coordinates(24, 21)))).toBe(
      true,
    );
  });

  it("rejects a move when both axes change or there is no move", () => {
    expect(tower.canMove(new Movement(from, new Coordinates(27, 27)))).toBe(
      false,
    );
    expect(tower.canMove(new Movement(from, new Coordinates(25, 26)))).toBe(
      false,
    );
    expect(tower.canMove(new Movement(from, new Coordinates(24, 24)))).toBe(
      false,
    );
  });

  describe("domain directions", () => {
    it("allows move right", () => {
      expect(tower.canMove(new Movement(from, new Coordinates(27, 24)))).toBe(
        true,
      );
    });

    it("allows move left", () => {
      expect(tower.canMove(new Movement(from, new Coordinates(21, 24)))).toBe(
        true,
      );
    });

    it("allows move up", () => {
      expect(tower.canMove(new Movement(from, new Coordinates(24, 27)))).toBe(
        true,
      );
    });

    it("allows move down", () => {
      expect(tower.canMove(new Movement(from, new Coordinates(24, 21)))).toBe(
        true,
      );
    });
  });
});
