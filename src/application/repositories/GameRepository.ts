import type { Game } from "@/domain/entities/ChessGame";
import type { FigureColor } from "@/domain/enums";
import type { Player } from "@/domain/entities/Player";

export interface GameRepository {
  getGame(): Game;
  getPlayers(): Record<FigureColor, Player>;
}
