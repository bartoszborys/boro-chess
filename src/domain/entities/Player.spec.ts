import { Player } from "@/domain/entities/Player";
import { FigureColor } from "@/domain/enums";

const whiteId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";

describe("Player", () => {
  describe("outOfTime", () => {
    it("returns true when timeLeft is 0", () => {
      expect(new Player(FigureColor.WHITE, whiteId, 0).outOfTime()).toBe(true);
    });

    it("returns false when timeLeft is greater than 0", () => {
      expect(new Player(FigureColor.WHITE, whiteId, 1).outOfTime()).toBe(false);
    });
  });

  describe("reduceTimeLeft", () => {
    it("leaves the player with remaining time when the reduction is smaller", () => {
      const player = new Player(FigureColor.WHITE, whiteId, 100);

      player.reduceTimeLeft(40);

      expect(player.outOfTime()).toBe(false);
    });

    it("marks the player out of time when remaining time is fully used", () => {
      const player = new Player(FigureColor.WHITE, whiteId, 50);

      player.reduceTimeLeft(50);

      expect(player.outOfTime()).toBe(true);
    });

    it("clamps remaining time at 0 when the reduction exceeds timeLeft", () => {
      const player = new Player(FigureColor.WHITE, whiteId, 10);

      player.reduceTimeLeft(20);

      expect(player.outOfTime()).toBe(true);
    });
  });

  describe("getEnemyColor", () => {
    it("returns black for a white player", () => {
      expect(new Player(FigureColor.WHITE, whiteId, 0).getEnemyColor()).toBe(FigureColor.BLACK);
    });

    it("returns white for a black player", () => {
      expect(new Player(FigureColor.BLACK, otherId, 0).getEnemyColor()).toBe(FigureColor.WHITE);
    });
  });

  describe("equals", () => {
    it("returns true when color and playerId match", () => {
      const player = new Player(FigureColor.WHITE, whiteId, 0);
      const samePlayer = new Player(FigureColor.WHITE, whiteId, 0);

      expect(player.equals(player)).toBe(true);
      expect(player.equals(samePlayer)).toBe(true);
    });

    it("returns false when playerId differs", () => {
      const player = new Player(FigureColor.WHITE, whiteId, 0);
      const other = new Player(FigureColor.WHITE, otherId, 0);

      expect(player.equals(other)).toBe(false);
    });
  });

  describe("playerId", () => {
    it("keeps the provided playerId", () => {
      const player = new Player(FigureColor.BLACK, otherId, 0);

      expect(player.playerId).toBe(otherId);
    });
  });
});
