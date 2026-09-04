import { BishopBehavior } from "@/chess/domain/entities/behaviors/BishopBehavior";
import { BlackPawnBehavior } from "@/chess/domain/entities/behaviors/BlackPawnBehavior";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import { KnightBehavior } from "@/chess/domain/entities/behaviors/KnightBehavior";
import { QueenBehavior } from "@/chess/domain/entities/behaviors/QueenBehavior";
import { RookBehavior } from "@/chess/domain/entities/behaviors/RookBehavior";
import { WhitePawnBehavior } from "@/chess/domain/entities/behaviors/WhitePawnBehavior";
import { FigureColor, FigureName } from "@/core/domain/enums";
import { InvalidFigureNameException } from "@/core/domain/exceptions";
import type { FigureBehaviorFactory } from "@/core/domain/factories/FigureBehaviorFactory";
import type { PawnFactory } from "@/chess/domain/factories/PawnFactory";

export class ChessFigureBehaviorFactory implements FigureBehaviorFactory, PawnFactory {
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
