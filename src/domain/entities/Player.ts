import { FigureColor } from "../enums";

export class Player {
  constructor(
    public readonly color: FigureColor,
    public readonly playerId: string,
    private timeLeftInSeconds: number,
  ) { }

  public getTimeLeftInSeconds(): number {
    return this.timeLeftInSeconds;
  }

  public outOfTime(): boolean {
    return this.timeLeftInSeconds === 0;
  }

  public reduceTimeLeft(time: number): void {
    this.timeLeftInSeconds = Math.max(this.timeLeftInSeconds - time, 0);
  }

  public getEnemyColor(): FigureColor {
    return this.color === FigureColor.WHITE ? FigureColor.BLACK : FigureColor.WHITE;
  }

  public equals(player: Player): boolean {
    return this.color === player.color
      && this.playerId === player.playerId;
  }
}
