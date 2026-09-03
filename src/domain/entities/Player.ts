import { FigureColor } from "../enums";

export class Player {
  constructor(
    public readonly color: FigureColor,
    public readonly playerId: string,
  ) { }

  public getEnemyColor(): FigureColor {
    return this.color === FigureColor.WHITE ? FigureColor.BLACK : FigureColor.WHITE;
  }

  public equals(player: Player): boolean {
    return this.color === player.color
      && this.playerId === player.playerId;
  }
}
