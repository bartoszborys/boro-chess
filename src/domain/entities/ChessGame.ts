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

export class ChessGame implements Game {
  private pendingPromotion: PendingPromotion | null = null;
  private currentPlayer: Player;
  private currentPlayerTimeStarted: number;

  constructor(
    private readonly players: Record<FigureColor, Player>,
    private readonly now: () => number = () => Date.now(),
  ) {
    const firstPlayer = players[FigureColor.WHITE];
    if (!firstPlayer) {
      throw new PlayerNotFound();
    }
    this.currentPlayer = firstPlayer;
    this.currentPlayerTimeStarted = this.now();
  }

  public getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  public nextPlayerTurn(): void {
    const enemyPlayer = this.players[this.currentPlayer.getEnemyColor()];
    if (!enemyPlayer) {
      throw new PlayerNotFound();
    }
    const timeDif = this.now() - this.currentPlayerTimeStarted;
    this.currentPlayer.reduceTimeLeft(timeDif / 1000);
    this.currentPlayer = enemyPlayer;
    this.currentPlayerTimeStarted = this.now();
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
