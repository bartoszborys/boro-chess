import { Coordinates } from "@/core/domain/value-objects/Coordinates";
import type { DirectionMoveVector } from "@/core/domain/value-objects/Direction";

describe("Coordinates", () => {
  const origin = new Coordinates(4, 5);
  const vector: DirectionMoveVector = { deltaX: 2, deltaY: -3 };

  describe("fromKey", () => {
    it("parses a key into coordinates", () => {
      expect(Coordinates.fromKey("4-5")).toEqual(new Coordinates(4, 5));
    });
  });

  describe("toKey", () => {
    it("returns the coordinates as a key", () => {
      expect(origin.toKey()).toBe("4-5");
    });
  });

  describe("add", () => {
    it("returns coordinates shifted by x and y", () => {
      const result = origin.add(2, -3);

      expect(result).toEqual(new Coordinates(6, 2));
    });

    it("adds x, y, or neither", () => {
      const addedX = origin.add(2);
      const addedY = origin.add(0, 1);
      const addedNone = origin.add();

      expect(addedX).toEqual(new Coordinates(6, 5));
      expect(addedY).toEqual(new Coordinates(4, 6));
      expect(addedNone).toEqual(new Coordinates(4, 5));
    });

    it("returns a new reference without mutating the original", () => {
      const result = origin.add(2, -3);

      expect(result).not.toBe(origin);
      expect(origin).toEqual(new Coordinates(4, 5));
    });
  });

  describe("addVector", () => {
    it("returns coordinates shifted by the vector", () => {
      const result = origin.addVector(vector);

      expect(result).toEqual(new Coordinates(6, 2));
    });

    it("returns a new reference without mutating the original", () => {
      const result = origin.addVector(vector);

      expect(result).not.toBe(origin);
      expect(origin).toEqual(new Coordinates(4, 5));
    });
  });

  describe("subtractVector", () => {
    it("returns coordinates shifted opposite to the vector", () => {
      const result = origin.subtractVector(vector);

      expect(result).toEqual(new Coordinates(2, 8));
    });

    it("returns a new reference without mutating the original", () => {
      const result = origin.subtractVector(vector);

      expect(result).not.toBe(origin);
      expect(origin).toEqual(new Coordinates(4, 5));
    });
  });

  describe("clone", () => {
    it("returns a new reference with the same x and y", () => {
      const result = origin.clone();

      expect(result).toEqual(new Coordinates(4, 5));
      expect(result).not.toBe(origin);
    });
  });

  describe("equals", () => {
    it("is true for the same x and y", () => {
      expect(origin.equals(new Coordinates(4, 5))).toBe(true);
    });

    it("is false when x or y differs", () => {
      expect(origin.equals(new Coordinates(5, 5))).toBe(false);
      expect(origin.equals(new Coordinates(4, 6))).toBe(false);
    });
  });

  describe("toString", () => {
    it("returns a readable representation", () => {
      expect(origin.toString()).toBe("Coordinates(4, 5)");
    });
  });
});
