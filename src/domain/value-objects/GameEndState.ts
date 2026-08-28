import type { Player } from "@/domain/entities/Player";

export type GameEndState = {
  draw: boolean;
  win: boolean;
  winner: Player | null;
};
