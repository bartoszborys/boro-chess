import { FigureColor, FigureName } from "@/core/domain/enums";
import type { Direction } from "@/core/domain/value-objects/Direction";

export type ChessCheckRule = {
  handlesFigure(figureName: FigureName): boolean;
  getDirections(): Direction[];
  canApplyToColor(color: FigureColor): boolean;
};
