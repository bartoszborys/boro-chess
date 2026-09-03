import type { PendingPromotion } from "@/domain/dtos";
import { Player } from "@/domain/entities/Player";
import { FigureColor } from "../enums";
import { PlayerNotFound } from "@/domain/exceptions";

export interface Game {
  playersCanMove(player: Player): boolean;
  awaitPromotion(pendingPromotion: PendingPromotion): void;
  getPendingPromotion(): PendingPromotion | null;
  promotionComplete(player: Player): boolean;
  nextPlayerTurn(): void;
  getCurrentPlayer(): Player;
}

export class CheesGame implements Game {
  private pendingPromotion: PendingPromotion | null = null;
  private currentPlayer: Player;

  constructor(private readonly players: Record<FigureColor, Player>) {
    const firstPlayer = players[FigureColor.WHITE];
    if (!firstPlayer) {
      throw new PlayerNotFound();
    }
    this.currentPlayer = firstPlayer;
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  public nextPlayerTurn(): void {
    const enemyPlayer = this.players[this.currentPlayer.getEnemyColor()];
    if (!enemyPlayer) {
      throw new PlayerNotFound();
    }
    this.currentPlayer = enemyPlayer;
  }

  public playersCanMove(player: Player): boolean {
    return this.pendingPromotion === null && this.currentPlayer.equals(player);
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
