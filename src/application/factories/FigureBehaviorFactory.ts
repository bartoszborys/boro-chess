import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import {
  BishopBehavior,
  BlackPawnBehavior,
  HorseBehavior,
  QueenBehavior,
  TowerBehavior,
  WhitePawnBehavior,
} from "@/domain/entities/behaviors";
import { FigureColor, FigureName } from "@/domain/enums";
import { InvalidFigureNameException } from "@/domain/exceptions";

export type PawnFactory = {
  createPawn(color: FigureColor): FigureBehavior;
};

export type FigureBehaviorFactory = {
  create(figureName: FigureName, color: FigureColor): FigureBehavior;
} & PawnFactory;

export class ChessFigureBehaviorFactory implements FigureBehaviorFactory {
  public create(figureName: FigureName, color: FigureColor): FigureBehavior {
    switch (figureName) {
      case FigureName.QUEEN:
        return new QueenBehavior();
      case FigureName.TOWER:
        return new TowerBehavior();
      case FigureName.BISHOP:
        return new BishopBehavior();
      case FigureName.HORSE:
        return new HorseBehavior();
      default:
        throw new InvalidFigureNameException(`Invalid figure name: ${figureName}`);
    }
  }

  public createPawn(color: FigureColor): FigureBehavior {
    return color === FigureColor.WHITE ? new WhitePawnBehavior() : new BlackPawnBehavior();
  }
}
