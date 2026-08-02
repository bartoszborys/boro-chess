import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { DirectionMoveVector } from "@/domain/value-objects/Direction";

describe("Coordinates", () => {
  const origin = new Coordinates(4, 5);
  const vector: DirectionMoveVector = { deltaX: 2, deltaY: -3 };

  describe("add", () => {
    it("returns coordinates shifted by x and y", () => {
      const result = origin.add(2, -3);

      expect(result).toEqual(new Coordinates(6, 2));
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
});
