import type { GameRepository } from "@/application/repositories/GameRepository";
import { CheesGame, type Game } from "@/domain/entities/CheesGame";
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
      this.game = new CheesGame(this.players);
    }
    return this.game;
  }
}
