import { Player } from "@/domain/entities/Player";
import { FigureColor } from "@/domain/enums";

const whiteId = "11111111-1111-4111-8111-111111111111";
const otherId = "22222222-2222-4222-8222-222222222222";

describe("Player", () => {
  describe("getEnemyColor", () => {
    it("returns black for a white player", () => {
      expect(new Player(FigureColor.WHITE, whiteId).getEnemyColor()).toBe(FigureColor.BLACK);
    });

    it("returns white for a black player", () => {
      expect(new Player(FigureColor.BLACK, otherId).getEnemyColor()).toBe(FigureColor.WHITE);
    });
  });

  describe("equals", () => {
    it("returns true when color and playerId match", () => {
      const player = new Player(FigureColor.WHITE, whiteId);
      const samePlayer = new Player(FigureColor.WHITE, whiteId);

      expect(player.equals(player)).toBe(true);
      expect(player.equals(samePlayer)).toBe(true);
    });

    it("returns false when playerId differs", () => {
      const player = new Player(FigureColor.WHITE, whiteId);
      const other = new Player(FigureColor.WHITE, otherId);

      expect(player.equals(other)).toBe(false);
    });
  });

  describe("playerId", () => {
    it("keeps the provided playerId", () => {
      const player = new Player(FigureColor.BLACK, otherId);

      expect(player.playerId).toBe(otherId);
    });
  });
});
