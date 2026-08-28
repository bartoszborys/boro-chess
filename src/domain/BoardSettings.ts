import { FigureColor } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";

export interface BoardSettings {
  getBoardSize(): [number, number];
  onLastRank(coordinate: Coordinates, color: FigureColor): boolean;
}

export class ChessBoardSettings implements BoardSettings {
  public getBoardSize(): [number, number] {
    return [8, 8];
  }

  public onLastRank({ y }: Coordinates, color: FigureColor): boolean {
    const [, ySize] = this.getBoardSize();

    if (color === FigureColor.WHITE) {
      return y === ySize - 1;
    }

    return y === 0;
  }
}