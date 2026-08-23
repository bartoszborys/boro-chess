import type { Player } from "@/domain/entities/Player";

export type GameEndResult = {
  draw: boolean;
  win: boolean;
  winner: Player | null;
};
