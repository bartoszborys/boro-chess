import type { Game } from "@/core/domain/entities/Game";
import type { FigureColor } from "@/core/domain/enums";
import type { Player } from "@/core/domain/entities/Player";

export interface GameRepository {
  getGame(): Game;
  getPlayers(): Record<FigureColor, Player>;
}
