import { FigureColor, FigureName } from "@/domain/enums";
import { Direction } from "@/domain/value-objects/Direction";

export type ChessCheckRule = {
  handlesFigure(figureName: FigureName): boolean;
  getDirections(): Direction[];
  canApplyToColor(color: FigureColor): boolean;
};
