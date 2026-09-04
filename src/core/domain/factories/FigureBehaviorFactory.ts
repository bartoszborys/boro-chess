import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { FigureName } from "@/core/domain/enums";

export type FigureBehaviorFactory = {
  create(figureName: FigureName): FigureBehavior;
};
