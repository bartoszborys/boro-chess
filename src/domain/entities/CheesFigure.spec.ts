import { CheesFigure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";
import { MovementValidator } from "@/domain/entities/movements/MovementValidator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";
const alwaysAllowed: MovementValidator = {
  getDirections: () => [],
  getThroughCoordinates: () => [],
};

function createValidator(directions: Direction[] = [], throughCoordinates: Coordinates[] = []): MovementValidator {
  return {
    getDirections: () => directions,
    getThroughCoordinates: () => throughCoordinates,
  };
}

describe("Figure", () => {
  describe("isOn", () => {
    it("returns true when the figure is on the coordinates", () => {
      const figure = new CheesFigure(new Coordinates(3, 5), alwaysAllowed);

      expect(figure.isOn(new Coordinates(3, 5))).toBe(true);
    });
  });

  describe("moveTo", () => {
    it.each([
      { x: 4, y: 7 },
      { x: 80, y: 24 },
    ])("updates current coordinates when the move to ($x, $y) is allowed", ({ x, y }) => {
      const figure = new CheesFigure(
        new Coordinates(0, 0),
        createValidator([new Direction({ deltaX: x, deltaY: y })]),
      );

      expect(figure.moveTo(new Coordinates(x, y))).toBe(true);
      expect(figure.isOn(new Coordinates(x, y))).toBe(true);
    });

    it("returns false when the direction does not match the destination", () => {
      const figure = new CheesFigure(
        new Coordinates(2, 3),
        createValidator([new Direction({ deltaX: 1, deltaY: 0 })]),
      );

      expect(figure.moveTo(new Coordinates(5, 6))).toBe(false);
      expect(figure.isOn(new Coordinates(2, 3))).toBe(true);
    });

    it("returns true when the movement validator allows the move", () => {
      const figure = new CheesFigure(
        new Coordinates(1, 1),
        createValidator([new Direction({ deltaX: 0, deltaY: 4 })]),
      );

      expect(figure.moveTo(new Coordinates(1, 5))).toBe(true);
      expect(figure.isOn(new Coordinates(1, 5))).toBe(true);
    });

    it("uses updated coordinates after a successful two-step move", () => {

      const figure = new CheesFigure(
        new Coordinates(0, 0),
        createValidator([new Direction({ deltaX: 2, deltaY: 2 })])
      );

      expect(figure.moveTo(new Coordinates(2, 2))).toBe(true);
      expect(figure.isOn(new Coordinates(2, 2))).toBe(true);

      expect(figure.moveTo(new Coordinates(4, 4))).toBe(true);
      expect(figure.isOn(new Coordinates(4, 4))).toBe(true);
    });

    it("returns false when capturing but the direction cannot capture", () => {
      const figure = new CheesFigure(
        new Coordinates(2, 3),
        createValidator([
          new Direction({ deltaX: 3, deltaY: 3, canCapture: false }),
        ]),
      );

      expect(figure.moveTo(new Coordinates(5, 6), true)).toBe(false);
      expect(figure.isOn(new Coordinates(2, 3))).toBe(true);
    });

    it("returns false when there is no direction to move to", () => {
      const figure = new CheesFigure(
        new Coordinates(2, 3),
        createValidator([]),
      );

      expect(figure.moveTo(new Coordinates(5, 6))).toBe(false);
      expect(figure.isOn(new Coordinates(2, 3))).toBe(true);
    });
  });

  describe("getThroughCoordinates", () => {
    it("throws FigureCannotMove when the movement validator rejects the move", () => {
      const figure = new CheesFigure(new Coordinates(2, 3), {
        getDirections: () => [],
        getThroughCoordinates: () => [],
      });

      expect(() =>
        figure.getThroughCoordinates(new Coordinates(5, 6)),
      ).toThrow(FigureInvalidMove);
    });

    it("returns collision coordinates from the movement validator when the move is allowed", () => {
      const collisionCoordinates = [
        new Coordinates(3, 4),
        new Coordinates(4, 5),
        new Coordinates(5, 6),
      ];
      const figure = new CheesFigure(
        new Coordinates(2, 3),
        createValidator([], collisionCoordinates),
      );
      jest.spyOn(figure as any, "canMove").mockReturnValue(true);

      expect(figure.getThroughCoordinates(new Coordinates(5, 6))).toEqual(
        collisionCoordinates,
      );
    });
  });

  describe("getDirectionTo", () => {
    const upDirection = new Direction({ deltaX: 0, deltaY: 1 });
    const rightDirection = new Direction({ deltaX: 1, deltaY: 0 });
    const downDirection = new Direction({ deltaX: 0, deltaY: -1 });

    const figure = new CheesFigure(new Coordinates(20, 20), {
      getDirections: () => [upDirection, rightDirection, downDirection],
      getThroughCoordinates: () => [],
    });

    it("returns the matching direction when moving straight up", () => {
      expect(figure.getDirectionTo(new Coordinates(20, 25))).toEqual(upDirection);
    });

    it("returns null when the target coordinate does not match any direction", () => {
      expect(figure.getDirectionTo(new Coordinates(21, 25))).toBeNull();
    });

    it("does select a capturing direction when capturing is false", () => {
      const capturingUp = new Direction({
        deltaX: 0,
        deltaY: 1,
        canCapture: true,
      });
      const capturingFigure = new CheesFigure(new Coordinates(20, 20), {
        getDirections: () => [capturingUp],
        getThroughCoordinates: () => [],
      });

      expect(
        capturingFigure.getDirectionTo(new Coordinates(20, 25), false),
      ).toEqual(capturingUp);
    });

    it("does not select a non-capturing direction when capturing is true", () => {
      const nonCapturingUp = new Direction({
        deltaX: 0,
        deltaY: 1,
        canCapture: false,
      });
      const capturingFigure = new CheesFigure(new Coordinates(20, 20), {
        getDirections: () => [nonCapturingUp],
        getThroughCoordinates: () => [],
      });

      expect(
        capturingFigure.getDirectionTo(new Coordinates(20, 25), true),
      ).toEqual(null);
    });
  });
});