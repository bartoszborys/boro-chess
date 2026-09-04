import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { BlackPawnBehavior } from "@/domain/entities/behaviors/BlackPawnBehavior";
import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { KnightBehavior } from "@/domain/entities/behaviors/KnightBehavior";
import { QueenBehavior } from "@/domain/entities/behaviors/QueenBehavior";
import { RookBehavior } from "@/domain/entities/behaviors/RookBehavior";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
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
