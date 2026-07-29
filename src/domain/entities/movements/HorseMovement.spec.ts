import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { Direction } from "@/domain/value-objects/Direction";
import { HorseMovement } from "./HorseMovement";

describe("HorseMovement", () => {
  const horse = new HorseMovement();
  const from = new Coordinates(24, 24);

  describe("getThroughCoordinates", () => {
    it("always returns an empty array", () => {
      expect(
        horse.getThroughCoordinates(
          new Movement(from, new Coordinates(26, 25)),
        ),
      ).toEqual([]);
    });
  });

  describe("getDirections", () => {
    it("returns all L-shaped directions with capture enabled and range 1", () => {
      const directions = horse.getDirections();

      expect(directions).toHaveLength(8);
      expect(directions).toEqual(
        expect.arrayContaining([
          new Direction({
            deltaX: 2,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 2,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -2,
            deltaY: 1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -2,
            deltaY: -1,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: 2,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: 1,
            deltaY: -2,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: 2,
            canCapture: true,
            maxRange: 1,
          }),
          new Direction({
            deltaX: -1,
            deltaY: -2,
            canCapture: true,
            maxRange: 1,
          }),
        ]),
      );
    });
  });
});
