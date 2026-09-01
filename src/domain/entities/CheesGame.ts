import type { PendingPromotion } from "@/domain/dtos";
import type { Player } from "@/domain/entities/Player";

export interface Game {
  playersCanMove(): boolean;
  awaitPromotion(pendingPromotion: PendingPromotion): void;
  getPendingPromotion(): PendingPromotion | null;
  promotionComplete(player: Player): boolean;
}

export class CheesGame implements Game {
  private pendingPromotion: PendingPromotion | null = null;

  public playersCanMove(): boolean {
    return this.pendingPromotion === null;
  }

  public awaitPromotion(pendingPromotion: PendingPromotion): void {
    this.pendingPromotion = pendingPromotion;
  }

  public getPendingPromotion(): PendingPromotion | null {
    return this.pendingPromotion;
  }

  public promotionComplete(player: Player): boolean {
    if (!this.pendingPromotion || !this.pendingPromotion.player.equals(player)) {
      return false;
    }

    this.pendingPromotion = null;
    return true;
  }
}
