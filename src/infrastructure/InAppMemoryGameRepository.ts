import type { GameRepository } from "@/application/repositories/GameRepository";
import { CheesGame, type Game } from "@/domain/entities/CheesGame";

export class InAppMemoryGameRepository implements GameRepository {
  private game: Game | null = null;

  public getGame(): Game {
    if (this.game === null) {
      this.game = new CheesGame();
    }
    return this.game;
  }
}
