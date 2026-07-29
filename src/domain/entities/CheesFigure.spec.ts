import { CheesFigure } from "@/domain/entities/CheesFigure";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { MovementValidator } from "@/domain/entities/movements/MovementValidator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { Direction } from "@/domain/value-objects/Direction";

const alwaysAllowed: MovementValidator = {
  getDirections: () => [],
};

function createValidator(directions: Direction[] = []): MovementValidator {
  return {
    getDirections: () => directions,
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
    ])("updates current coordinates to ($x, $y)", ({ x, y }) => {
      const figure = new CheesFigure(new Coordinates(0, 0), alwaysAllowed);

      figure.moveTo(new Coordinates(x, y));

      expect(figure.isOn(new Coordinates(x, y))).toBe(true);
    });

    it("uses updated coordinates after a successful two-step move", () => {
      const figure = new CheesFigure(new Coordinates(0, 0), alwaysAllowed);

      figure.moveTo(new Coordinates(2, 2));
      expect(figure.isOn(new Coordinates(2, 2))).toBe(true);

      figure.moveTo(new Coordinates(4, 4));
      expect(figure.isOn(new Coordinates(4, 4))).toBe(true);
    });
  });

  describe("getThroughCoordinates", () => {
    it("throws FigureInvalidMove when there is no matching direction", () => {
      const figure = new CheesFigure(
        new Coordinates(2, 3),
        createValidator([]),
      );

      expect(() => figure.getThroughCoordinates(new Coordinates(5, 6))).toThrow(
        FigureInvalidMove,
      );
    });

    it.each([
      {
        name: "top-left",
        deltaX: -1,
        deltaY: 1,
        to: new Coordinates(5, 15),
        through: [
          new Coordinates(9, 11),
          new Coordinates(8, 12),
          new Coordinates(7, 13),
          new Coordinates(6, 14),
        ],
      },
      {
        name: "bottom-right",
        deltaX: 1,
        deltaY: -1,
        to: new Coordinates(15, 5),
        through: [
          new Coordinates(11, 9),
          new Coordinates(12, 8),
          new Coordinates(13, 7),
          new Coordinates(14, 6),
        ],
      },
      {
        name: "left",
        deltaX: -1,
        deltaY: 0,
        to: new Coordinates(5, 10),
        through: [
          new Coordinates(9, 10),
          new Coordinates(8, 10),
          new Coordinates(7, 10),
          new Coordinates(6, 10),
        ],
      },
      {
        name: "right",
        deltaX: 1,
        deltaY: 0,
        to: new Coordinates(15, 10),
        through: [
          new Coordinates(11, 10),
          new Coordinates(12, 10),
          new Coordinates(13, 10),
          new Coordinates(14, 10),
        ],
      },
    ])(
      "returns intermediate coordinates when moving 5 steps $name",
      ({ deltaX, deltaY, to, through }) => {
        const figure = new CheesFigure(
          new Coordinates(10, 10),
          createValidator([new Direction({ deltaX, deltaY })]),
        );

        expect(figure.getThroughCoordinates(to)).toEqual(through);
      },
    );

    it("returns no intermediate coordinates for a horse-like custom vector", () => {
      const figure = new CheesFigure(
        new Coordinates(10, 10),
        createValidator([new Direction({ deltaX: 2, deltaY: 1, maxRange: 1 })]),
      );

      expect(figure.getThroughCoordinates(new Coordinates(12, 11))).toEqual([]);
    });

    it("returns intermediate coordinates for a custom vector", () => {
      const figure = new CheesFigure(
        new Coordinates(10, 10),
        createValidator([new Direction({ deltaX: 13, deltaY: 7, maxRange: 3 })]),
      );

      expect(figure.getThroughCoordinates(new Coordinates(49, 31))).toEqual([
        new Coordinates(23, 17),
        new Coordinates(36, 24),
      ]);
    });
  });

  describe("getDirectionTo", () => {
    const upDirection = new Direction({ deltaX: 0, deltaY: 1 });
    const rightDirection = new Direction({ deltaX: 1, deltaY: 0 });
    const downDirection = new Direction({ deltaX: 0, deltaY: -1 });

    const figure = new CheesFigure(new Coordinates(20, 20), {
      getDirections: () => [upDirection, rightDirection, downDirection],
    });

    it("returns the matching direction when moving straight up", () => {
      expect(figure.getDirectionTo(new Coordinates(20, 25), false)).toEqual(
        upDirection,
      );
    });

    it("returns null when the target coordinate does not match any direction", () => {
      expect(figure.getDirectionTo(new Coordinates(21, 25), false)).toBeNull();
    });

    it("does select a capturing direction when capturing is false", () => {
      const capturingUp = new Direction({
        deltaX: 0,
        deltaY: 1,
        canCapture: true,
      });
      const capturingFigure = new CheesFigure(new Coordinates(20, 20), {
        getDirections: () => [capturingUp],
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
      });

      expect(
        capturingFigure.getDirectionTo(new Coordinates(20, 25), true),
      ).toEqual(null);
    });
  });
});
