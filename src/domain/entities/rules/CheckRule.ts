import { FigureColor, FigureName } from "@/domain/enums";
import { Direction } from "@/domain/value-objects/Direction";

export type ChessCheckRule = {
  isCheck(figureName: FigureName): boolean;
  getDirections(): Direction[];
  canApplyToColor(color: FigureColor): boolean;
};
