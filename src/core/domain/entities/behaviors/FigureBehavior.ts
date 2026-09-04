import type { Direction } from "@/core/domain/value-objects/Direction";
import type { FigureName } from "@/core/domain/enums";

export interface FigureBehavior {
  getDirections(): Direction[];
  getName(): FigureName;
}
