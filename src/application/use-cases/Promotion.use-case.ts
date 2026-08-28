import { Game } from "@/domain/entities/CheesGame";
import { Player } from "@/domain/entities/Player";
import { FigureName } from "@/domain/enums";
import { FigureBehaviorFactory } from "../factories/FigureBehaviorFactory";
import { Board } from "@/domain";

export class FigurePromotionUseCase {
  constructor(
    private readonly game: Game,
    private readonly figureBehaviorFactory: FigureBehaviorFactory,
  ) { }

  public execute(board: Board, player: Player, figureName: FigureName): void {
    const figureBehavior = this.figureBehaviorFactory.create(figureName, player.color);
    this.game.promotionComplete(board, player, figureBehavior);
  }
}
