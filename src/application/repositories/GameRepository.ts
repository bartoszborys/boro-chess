import type { Game } from "@/domain/entities/CheesGame";

export interface GameRepository {
  getGame(): Game;
}
