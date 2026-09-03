import type { BoardRepository } from "@/application/repositories/BoardRepository";
import type { GameRepository } from "@/application/repositories/GameRepository";
import { Player } from "@/domain/entities/Player";
import { FigureName } from "@/domain/enums";
import type { FigureBehaviorFactory } from "../factories/FigureBehaviorFactory";
import type { MoveMaker } from "@/domain/services/MoveMaker";

export class FigurePromotionUseCase {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly gameRepository: GameRepository,
    private readonly figureBehaviorFactory: FigureBehaviorFactory,
    private readonly moveMaker: MoveMaker,
  ) {}

  public execute(player: Player, figureName: FigureName): void {
    const game = this.gameRepository.getGame();
    const pendingPromotion = game.getPendingPromotion();

    if (!pendingPromotion || !pendingPromotion.player.equals(player)) {
      return;
    }

    const board = this.boardRepository.getBoard();
    const figureBehavior = this.figureBehaviorFactory.create(figureName);
    this.moveMaker.promote(board, pendingPromotion.coordinates, figureBehavior);
    game.promotionComplete(player);
  }
}
