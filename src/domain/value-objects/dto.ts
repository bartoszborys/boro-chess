import type { Player } from "@/domain/entities/Player";
import type { Coordinates } from "@/domain/value-objects/Coordinates";
import type { GameEndState } from "@/domain/value-objects/GameEndState";

export type PendingPromotion = {
  player: Player;
  coordinates: Coordinates;
};

export type PlayerFigureMoveResult = {
  gameEndState: GameEndState | null;
  promotion: boolean;
};

