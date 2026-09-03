import type { Game } from "@/domain/entities/ChessGame";

export interface GameRepository {
  getGame(): Game;
}
