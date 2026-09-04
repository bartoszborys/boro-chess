import type { BoardSettings } from "@/core/domain/services/BoardSettings";

export class ChessBoardSettings implements BoardSettings {
  public getBoardSize(): [number, number] {
    return [8, 8];
  }
}
