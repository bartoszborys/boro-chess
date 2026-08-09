import { CheesPathGenerator } from "@/domain/services/PathGenerator";
import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import { Movement } from "@/domain/value-objects/Movement";

const board3x3: CoordinatesKey[] = ["1-1", "2-1", "3-1", "1-2", "2-2", "3-2", "1-3", "2-3", "3-3"];

const directions = [
  { deltaX: 0, deltaY: 1, maxRange: 3 },
  { deltaX: 1, deltaY: 1, maxRange: 3 },
  { deltaX: 1, deltaY: 0, maxRange: 3 },
  { deltaX: 1, deltaY: -1, maxRange: 3 },
  { deltaX: 0, deltaY: -1, maxRange: 3 },
  { deltaX: -1, deltaY: -1, maxRange: 3 },
  { deltaX: -1, deltaY: 0, maxRange: 3 },
  { deltaX: -1, deltaY: 1, maxRange: 3 },
];

describe("CheesPathGenerator", () => {
  describe("forVectorMovementOnExistingFields", () => {
    it("should generate paths in every direction across a 3x3 board from the center", () => {
      const pathGenerator = new CheesPathGenerator();
      const from = new Coordinates(2, 2);

      const paths = directions.flatMap((direction) =>
        pathGenerator.forDirectionOnExistingFields({
          from,
          direction,
          existingFields: board3x3,
        }),
      );

      expect(paths).toEqual(
        expect.arrayContaining([
          new Coordinates(2, 3),
          new Coordinates(3, 3),
          new Coordinates(3, 2),
          new Coordinates(3, 1),
          new Coordinates(2, 1),
          new Coordinates(1, 1),
          new Coordinates(1, 2),
          new Coordinates(1, 3),
        ]),
      );
      expect(paths).toHaveLength(8);
    });

    it("should stop at the board edge when starting from the far right side", () => {
      const pathGenerator = new CheesPathGenerator();
      const from = new Coordinates(3, 2);

      const paths = directions.flatMap((direction) =>
        pathGenerator.forDirectionOnExistingFields({
          from,
          direction,
          existingFields: board3x3,
        }),
      );

      expect(paths).toEqual(
        expect.arrayContaining([
          new Coordinates(3, 3),
          new Coordinates(3, 1),
          new Coordinates(2, 1),
          new Coordinates(2, 2),
          new Coordinates(1, 2),
          new Coordinates(2, 3),
        ]),
      );
      expect(paths).toHaveLength(6);
    });
  });

  describe("forVectorMovementWithoutTarget", () => {
    it("should generate intermediate coordinates for a linear 1,1 move across several fields", () => {
      const pathGenerator = new CheesPathGenerator();
      const path = pathGenerator.forVectorMovementWithoutTarget({
        movement: new Movement(new Coordinates(1, 1), new Coordinates(5, 5)),
        stepVector: { deltaX: 1, deltaY: 1 },
      });

      expect(path).toHaveLength(3);
      expect(path).toEqual([new Coordinates(2, 2), new Coordinates(3, 3), new Coordinates(4, 4)]);
    });

    it.each([
      {
        name: "one 8,8 step",
        to: new Coordinates(9, 9),
        expectedPath: [] as Coordinates[],
      },
      {
        name: "two 8,8 steps",
        to: new Coordinates(17, 17),
        expectedPath: [new Coordinates(9, 9)],
      },
    ])("should generate intermediate coordinates for a non-linear 8,8 move with $name", ({ to, expectedPath }) => {
      const pathGenerator = new CheesPathGenerator();
      const path = pathGenerator.forVectorMovementWithoutTarget({
        movement: new Movement(new Coordinates(1, 1), to),
        stepVector: { deltaX: 8, deltaY: 8 },
      });

      expect(path).toEqual(expectedPath);
      expect(path).toHaveLength(expectedPath.length);
    });
  });
});
