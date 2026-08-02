import type { Direction } from "@/domain/value-objects/Direction";
import type { FigureName } from "@/domain/enums";

export interface FigureBehavior {
  getDirections(): Direction[];
  getName(): FigureName;
}
