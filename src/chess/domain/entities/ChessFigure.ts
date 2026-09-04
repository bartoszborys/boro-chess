import type { Figure } from "@/core/domain/entities/Figure";
import type { FigureBehavior } from "@/core/domain/entities/behaviors/FigureBehavior";
import type { Direction } from "@/core/domain/value-objects/Direction";
import { FigureColor, FigureName } from "@/core/domain/enums";

export class ChessFigure implements Figure {
  private _hasMoved: boolean = false;
  private readonly color: FigureColor;
  private figureBehavior: FigureBehavior;

  constructor(color: FigureColor, figureBehavior: FigureBehavior) {
    this.color = color;
    this.figureBehavior = figureBehavior;
  }

  public promote(figureBehavior: FigureBehavior): void {
    this.figureBehavior = figureBehavior;
  }

  public getName(): FigureName {
    return this.figureBehavior.getName();
  }

  public markAsMoved(): void {
    this._hasMoved = true;
  }

  public getDirections(): Direction[] {
    return this.figureBehavior.getDirections();
  }

  public hasMoved(): boolean {
    return this._hasMoved;
  }

  public markAsNotMoved(): void {
    this._hasMoved = false;
  }

  public isFriendly(figure: Figure | null): boolean {
    if (figure === null) {
      return false;
    }

    return this.color === figure.getColor();
  }

  public getColor(): FigureColor {
    return this.color;
  }

  public canBeCaptured(): boolean {
    return this.figureBehavior.getName() !== FigureName.KING;
  }
}
