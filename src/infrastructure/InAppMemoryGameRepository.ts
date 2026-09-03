import type { GameRepository } from "@/application/repositories/GameRepository";
import { ChessGame, type Game } from "@/domain/entities/ChessGame";
import { Player } from "@/domain/entities/Player";
import { FigureColor } from "@/domain/enums";

export class InAppMemoryGameRepository implements GameRepository {
  private game: Game | null = null;
  private players: Record<FigureColor, Player> = {
    [FigureColor.WHITE]: new Player(FigureColor.WHITE, crypto.randomUUID()),
    [FigureColor.BLACK]: new Player(FigureColor.BLACK, crypto.randomUUID()),
  };

  public getGame(): Game {
    if (this.game === null) {
      this.game = new ChessGame(this.players);
    }
    return this.game;
  }
}
