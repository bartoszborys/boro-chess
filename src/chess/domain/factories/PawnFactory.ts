import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { FigureColor } from "@/core/domain/enums";

export type PawnFactory = {
  createPawn(color: FigureColor): FigureBehavior;
};
