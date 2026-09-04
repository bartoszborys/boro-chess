import {
  BishopBehavior,
  BlackPawnBehavior,
  type FigureBehavior,
  KnightBehavior,
  QueenBehavior,
  RookBehavior,
  WhitePawnBehavior,
} from "@/domain";
import { FigureColor, FigureName } from "@/domain/enums";
import { InvalidFigureNameException } from "@/domain/exceptions";

export type PawnFactory = {
  createPawn(color: FigureColor): FigureBehavior;
};

export type FigureBehaviorFactory = {
  create(figureName: FigureName): FigureBehavior;
} & PawnFactory;

export class ChessFigureBehaviorFactory implements FigureBehaviorFactory {
  public create(figureName: FigureName): FigureBehavior {
    switch (figureName) {
      case FigureName.QUEEN:
        return new QueenBehavior();
      case FigureName.ROOK:
        return new RookBehavior();
      case FigureName.BISHOP:
        return new BishopBehavior();
      case FigureName.KNIGHT:
        return new KnightBehavior();
      default:
        throw new InvalidFigureNameException(`Invalid figure name: ${figureName}`);
    }
  }

  public createPawn(color: FigureColor): FigureBehavior {
    return color === FigureColor.WHITE ? new WhitePawnBehavior() : new BlackPawnBehavior();
  }
}
