import type { BoardState, GameEndState } from "@/core/domain/dtos";
import type { FigureColor } from "@/core/domain/enums";
import type { Player } from "@/core/domain/entities/Player";

export type GameRules = {
  boardValidStateForPlayer(boardState: BoardState, movingPlayerColor: FigureColor): boolean;
  checkGameEndState(boardState: BoardState, player: Player): GameEndState;
  promotionAvailable(boardState: BoardState): boolean;
};
