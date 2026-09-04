import type { PendingPromotion } from "@/core/domain/dtos";
import type { Player } from "@/core/domain/entities/Player";

export interface Game {
  playersCanMove(player: Player): boolean;
  awaitPromotion(pendingPromotion: PendingPromotion): void;
  getPendingPromotion(): PendingPromotion | null;
  promotionComplete(player: Player): boolean;
  nextPlayerTurn(): void;
  getCurrentPlayer(): Player;
}
