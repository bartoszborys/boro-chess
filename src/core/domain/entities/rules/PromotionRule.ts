import type { FigureColor, FigureName } from "@/core/domain/enums";
import type { Coordinates } from "@/core/domain/value-objects/Coordinates";

export interface PromotionRule {
  isPromotable(figureName: FigureName, color: FigureColor, coordinate: Coordinates): boolean;
}
