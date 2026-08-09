import { Direction } from "@/domain/value-objects/Direction";
import { DirectionsBuilder } from "@/domain/builders/DirectionsBuilder";

describe("DirectionsBuilder", () => {
  describe("default deltas", () => {
    it("adds top as positive Y", () => {
      expect(DirectionsBuilder.create().addTopDirection().build()).toEqual([new Direction({ deltaX: 0, deltaY: 1 })]);
    });

    it("adds bottom as negative Y", () => {
      expect(DirectionsBuilder.create().addBottomDirection().build()).toEqual([
        new Direction({ deltaX: 0, deltaY: -1 }),
      ]);
    });

    it("adds top-left as negative X and positive Y", () => {
      expect(DirectionsBuilder.create().addTopLeftDirection().build()).toEqual([
        new Direction({ deltaX: -1, deltaY: 1 }),
      ]);
    });

    it("adds top-right as positive X and positive Y", () => {
      expect(DirectionsBuilder.create().addTopRightDirection().build()).toEqual([
        new Direction({ deltaX: 1, deltaY: 1 }),
      ]);
    });

    it("adds bottom-left as negative X and negative Y", () => {
      expect(DirectionsBuilder.create().addBottomLeftDirection().build()).toEqual([
        new Direction({ deltaX: -1, deltaY: -1 }),
      ]);
    });

    it("adds bottom-right as positive X and negative Y", () => {
      expect(DirectionsBuilder.create().addBottomRightDirection().build()).toEqual([
        new Direction({ deltaX: 1, deltaY: -1 }),
      ]);
    });

    it("adds left as negative X", () => {
      expect(DirectionsBuilder.create().addLeftDirection().build()).toEqual([new Direction({ deltaX: -1, deltaY: 0 })]);
    });

    it("adds right as positive X", () => {
      expect(DirectionsBuilder.create().addRightDirection().build()).toEqual([new Direction({ deltaX: 1, deltaY: 0 })]);
    });
  });

  describe("addCustomDirection", () => {
    it("adds a direction with arbitrary deltas", () => {
      expect(DirectionsBuilder.create().addCustomDirection(20, 20).build()).toEqual([
        new Direction({ deltaX: 20, deltaY: 20 }),
      ]);
    });
  });
});
