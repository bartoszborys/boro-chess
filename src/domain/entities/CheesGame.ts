import type { PendingPromotion } from "@/domain/dtos";
import { Player } from "@/domain/entities/Player";
import { FigureColor } from "../enums";

export interface Game {
  playersCanMove(player: Player): boolean;
  awaitPromotion(pendingPromotion: PendingPromotion): void;
  getPendingPromotion(): PendingPromotion | null;
  promotionComplete(player: Player): boolean;
  nextPlayerTurn(): void;
  getCurrentTurn(): Player;
}

export class CheesGame implements Game {
  private pendingPromotion: PendingPromotion | null = null;
  private playerTurn: Player = new Player(FigureColor.WHITE);

  public getCurrentTurn(): Player {
    return this.playerTurn;
  }

  public nextPlayerTurn(): void {
    this.playerTurn = new Player(this.playerTurn.getEnemyColor());
  }

  public playersCanMove(player: Player): boolean {
    return this.pendingPromotion === null && this.playerTurn.equals(player);
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
