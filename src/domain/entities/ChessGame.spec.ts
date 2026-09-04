import type { PendingPromotion } from "@/domain/dtos";
import { ChessGame } from "@/domain/entities/ChessGame";
import { Player } from "@/domain/entities/Player";
import { FigureColor } from "@/domain/enums";
import { PlayerNotFound } from "@/domain/exceptions";
import { Coordinates } from "@/domain/value-objects/Coordinates";

const whiteId = "11111111-1111-4111-8111-111111111111";
const blackId = "22222222-2222-4222-8222-222222222222";

const createPlayers = (timeLeftInSeconds = 100) => {
  const white = new Player(FigureColor.WHITE, whiteId, timeLeftInSeconds);
  const black = new Player(FigureColor.BLACK, blackId, timeLeftInSeconds);

  return {
    white,
    black,
    players: {
      [FigureColor.WHITE]: white,
      [FigureColor.BLACK]: black,
    },
  };
};

describe("ChessGame", () => {
  describe("constructor", () => {
    it("throws PlayerNotFound when the white player is missing", () => {
      const black = new Player(FigureColor.BLACK, blackId, 100);

      expect(() => new ChessGame({ [FigureColor.BLACK]: black } as Record<FigureColor, Player>)).toThrow(
        PlayerNotFound,
      );
    });
  });

  describe("promotion", () => {
    it("returns null until a promotion is started, then keeps it until complete", () => {
      const { white, black, players } = createPlayers();
      const game = new ChessGame(players);
      const pendingPromotion: PendingPromotion = {
        player: white,
        coordinates: new Coordinates(1, 8),
      };

      expect(game.getPendingPromotion()).toBeNull();

      game.awaitPromotion(pendingPromotion);

      expect(game.getPendingPromotion()).toBe(pendingPromotion);
      expect(game.promotionComplete(black)).toBe(false);
      expect(game.getPendingPromotion()).toBe(pendingPromotion);
      expect(game.promotionComplete(white)).toBe(true);
      expect(game.getPendingPromotion()).toBeNull();
    });

    it("returns false from promotionComplete when no promotion is pending", () => {
      const { white, players } = createPlayers();
      const game = new ChessGame(players);

      expect(game.promotionComplete(white)).toBe(false);

      game.awaitPromotion({
        player: white,
        coordinates: new Coordinates(1, 8),
      });
      game.promotionComplete(white);

      expect(game.promotionComplete(white)).toBe(false);
    });

    it("blocks both players from moving while a promotion is pending", () => {
      const { white, black, players } = createPlayers();
      const game = new ChessGame(players);

      expect(game.playersCanMove(white)).toBe(true);
      expect(game.playersCanMove(black)).toBe(false);

      game.awaitPromotion({
        player: white,
        coordinates: new Coordinates(1, 8),
      });

      expect(game.playersCanMove(white)).toBe(false);
      expect(game.playersCanMove(black)).toBe(false);

      game.promotionComplete(white);

      expect(game.playersCanMove(white)).toBe(true);
      expect(game.playersCanMove(black)).toBe(false);
    });
  });

  describe("playersCanMove", () => {
    it("allows only the current player to move", () => {
      const { white, black, players } = createPlayers();
      const game = new ChessGame(players);

      expect(game.playersCanMove(white)).toBe(true);
      expect(game.playersCanMove(black)).toBe(false);

      game.nextPlayerTurn();

      expect(game.playersCanMove(white)).toBe(false);
      expect(game.playersCanMove(black)).toBe(true);
    });
  });

  describe("nextPlayerTurn", () => {
    it("switches the current player to the opponent", () => {
      const { white, black, players } = createPlayers();
      const game = new ChessGame(players);

      expect(game.getCurrentPlayer()).toBe(white);

      game.nextPlayerTurn();

      expect(game.getCurrentPlayer()).toBe(black);

      game.nextPlayerTurn();

      expect(game.getCurrentPlayer()).toBe(white);
    });

    it("reduces the finishing player's time by the elapsed seconds", () => {
      let now = 1_000;
      const { white, black, players } = createPlayers(100);
      const game = new ChessGame(players, () => now);

      now = 6_000;
      game.nextPlayerTurn();

      expect(white.getTimeLeftInSeconds()).toBe(95);
      expect(black.getTimeLeftInSeconds()).toBe(100);

      now = 9_000;
      game.nextPlayerTurn();

      expect(white.getTimeLeftInSeconds()).toBe(95);
      expect(black.getTimeLeftInSeconds()).toBe(97);
    });

    it("clamps remaining time at 0 when elapsed time exceeds time left", () => {
      let now = 1_000;
      const { white, black, players } = createPlayers(2);
      const game = new ChessGame(players, () => now);

      now = 6_000;
      game.nextPlayerTurn();

      expect(white.getTimeLeftInSeconds()).toBe(0);
      expect(white.outOfTime()).toBe(true);
      expect(black.getTimeLeftInSeconds()).toBe(2);
    });

    it("throws PlayerNotFound when the opponent is missing", () => {
      const white = new Player(FigureColor.WHITE, whiteId, 100);
      const game = new ChessGame({ [FigureColor.WHITE]: white } as Record<FigureColor, Player>);

      expect(() => game.nextPlayerTurn()).toThrow(PlayerNotFound);
    });
  });
});
