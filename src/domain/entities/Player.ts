import { FigureColor } from "../enums";

export class Player {
  constructor(public readonly color: FigureColor) {}

  public getEnemyColor(): FigureColor {
    return this.color === FigureColor.WHITE ? FigureColor.BLACK : FigureColor.WHITE;
  }
}
