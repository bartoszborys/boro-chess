import type { GameRepository } from "@/core/application/repositories/GameRepository";
import type { Game } from "@/core/domain/entities/Game";
import { ChessGame } from "@/chess/domain/entities/ChessGame";
import { Player } from "@/core/domain/entities/Player";
import { FigureColor } from "@/core/domain/enums";

export class InAppMemoryGameRepository implements GameRepository {
  private game: Game | null = null;
  private players: Record<FigureColor, Player> = {
    [FigureColor.WHITE]: new Player(FigureColor.WHITE, crypto.randomUUID(), 5 * 60),
    [FigureColor.BLACK]: new Player(FigureColor.BLACK, crypto.randomUUID(), 5 * 60),
  };

  public getGame(): Game {
    if (this.game === null) {
      this.game = new ChessGame(this.players);
    }
    return this.game;
  }

  public getPlayers(): Record<FigureColor, Player> {
    return this.players;
  }
}
