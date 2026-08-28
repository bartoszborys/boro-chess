import type { Player } from "@/domain/entities/Player";
import type { Coordinates } from "@/domain/value-objects/Coordinates";

export type PendingPromotion = {
  player: Player;
  coordinates: Coordinates;
};

export type PlayerFigureMoveResult = {
  promotion: boolean;
};

