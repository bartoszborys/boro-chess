export interface BoardSettings {
  getBoardSize(): [number, number];
}

export class ChessBoardSettings implements BoardSettings {
  public getBoardSize(): [number, number] {
    return [8, 8];
  }
}
