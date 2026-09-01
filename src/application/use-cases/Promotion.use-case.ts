import type { GameRepository } from "@/application/repositories/GameRepository";
import { Player } from "@/domain/entities/Player";
import { FigureName } from "@/domain/enums";
import { FigureBehaviorFactory } from "../factories/FigureBehaviorFactory";
import { Board } from "@/domain";
import type { MoveMaker } from "@/domain/services/MoveMaker";

export class FigurePromotionUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly figureBehaviorFactory: FigureBehaviorFactory,
    private readonly moveApplier: MoveMaker,
  ) {}

  public execute(board: Board, player: Player, figureName: FigureName): void {
    const game = this.gameRepository.getGame();
    const pendingPromotion = game.getPendingPromotion();

    if (!pendingPromotion || !pendingPromotion.player.equals(player)) {
      return;
    }

    const figureBehavior = this.figureBehaviorFactory.create(figureName);
    this.moveApplier.promote(board, pendingPromotion.coordinates, figureBehavior);
    game.promotionComplete(player);
  }
}
