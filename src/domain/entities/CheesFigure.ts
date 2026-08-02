import type { FigureBehavior } from "@/domain/entities/behaviors/FigureBehavior";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Direction } from "@/domain/value-objects/Direction";
import { CapturedFigure } from "@/domain/value-objects/CapturedFigure";
import { FigureColor, FigureName } from "@/domain/enums";
import { FigureInvalidMove } from "../exceptions";

export interface Figure {
  canCastle(figure: Figure): void;
  isOn(coordinates: Coordinates): boolean;
  getDirections(): Direction[];
  hasMoved(): boolean;
  moveTo(to: Coordinates): void;
  capturedDetails(): CapturedFigure;
  getColor(): FigureColor;
  isFriendly(figure?: Figure): boolean;
}

export class CheesFigure implements Figure {
  private _hasMoved: boolean = false;
  private coordinates: Coordinates;
  private readonly color: FigureColor;
  private readonly figureBehavior: FigureBehavior;

  constructor(coordinates: Coordinates, color: FigureColor, figureBehavior: FigureBehavior) {
    this.coordinates = coordinates;
    this.color = color;
    this.figureBehavior = figureBehavior;
  }

  public canCastle(figure: Figure): void {
    if (this.figureBehavior.getName() !== FigureName.TOWER) {
      throw new FigureInvalidMove(
        `Cannot be castled by not a tower`,
      );
    }

    if (!figure.isFriendly(this)) {
      throw new FigureInvalidMove(
        `Cannot be castled by not a friendly figure`,
      );
    }

    if (figure.hasMoved()) {
      throw new FigureInvalidMove(
        `Cannot be castled by a figure that has already moved`,
      );
    }
  }

  public isOn(coordinates: Coordinates): boolean {
    return this.coordinates.equals(coordinates);
  }

  public moveTo(to: Coordinates): void {
    this._hasMoved = true;
    this.coordinates = to;
  }

  public getDirections(): Direction[] {
    return this.figureBehavior.getDirections();
  }

  public hasMoved(): boolean {
    return this._hasMoved;
  }

  public capturedDetails(): CapturedFigure {
    return {
      name: this.figureBehavior.getName(),
      color: this.color,
    };
  }

  public isFriendly(figure?: Figure): boolean {
    if (!figure) {
      return false;
    }

    return this.color === figure.getColor();
  }

  public getColor(): FigureColor {
    return this.color;
  }
}
