import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";
import { FigureDetails } from "@/domain/value-objects/CapturedFigure";
import { FigureColor, FigureName } from "@/domain/enums";

export interface Figure {
  getName(): FigureName;
  getDirections(): Direction[];
  hasMoved(): boolean;
  markAsMoved(): void;
  figureDetails(): FigureDetails;
  getColor(): FigureColor;
  isFriendly(figure: Figure | null): boolean;
  canBeCaptured(): boolean;
}

export class CheesFigure implements Figure {
  private _hasMoved: boolean = false;
  private readonly color: FigureColor;
  private readonly figureBehavior: FigureBehavior;

  constructor(color: FigureColor, figureBehavior: FigureBehavior) {
    this.color = color;
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

  public figureDetails(): FigureDetails {
    return {
      name: this.getName(),
      color: this.color,
    };
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
