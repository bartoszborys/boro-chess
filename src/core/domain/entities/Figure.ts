import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { Direction } from "@/core/domain/value-objects/Direction";
import type { FigureColor, FigureName } from "@/core/domain/enums";

export interface Figure {
  promote(figureBehavior: FigureBehavior): void;
  getName(): FigureName;
  getDirections(): Direction[];
  hasMoved(): boolean;
  markAsMoved(): void;
  markAsNotMoved(): void;
  getColor(): FigureColor;
  isFriendly(figure: Figure | null): boolean;
  canBeCaptured(): boolean;
}
