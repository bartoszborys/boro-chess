import type { PathGenerator } from "@/domain/services/PathGenerator";
import { KingNotFound } from "@/domain/exceptions";
import { FigureColor, FigureName } from "@/domain/enums";
import type { BoardFigureState, BoardState, GameEndState } from "@/domain/dtos";
import type { Player } from "@/domain/entities/Player";
import type { PromotionRule } from "@/domain/entities/rules/PromotionRule";
import type { KingCheck } from "@/domain/services/KingCheck";

export type GameRules = {
  boardValidStateForPlayer(boardState: BoardState, movingPlayerColor: FigureColor): boolean;
  checkGameEndState(boardState: BoardState, player: Player): GameEndState;
  promotionAvailable(boardState: BoardState): boolean;
};

export class ChessGameRules implements GameRules {
  constructor(
    private readonly kingCheck: KingCheck,
    private readonly promotionRules: PromotionRule[],
  ) {}

  public promotionAvailable(boardState: BoardState): boolean {
    const { figuresState } = boardState;
    return figuresState.some((figure) =>
      this.promotionRules.some((rule) => rule.isPromotable(figure.name, figure.color, figure.coordinates)),
    );
  }

  public boardValidStateForPlayer(boardState: BoardState, movingPlayerColor: FigureColor): boolean {
    const { figuresState } = boardState;
    const playerKingState = figuresState.find(
      (figure) => figure.name === FigureName.KING && figure.color === movingPlayerColor,
    );

    if (!playerKingState) {
      throw new KingNotFound();
    }

    if (this.kingCheck.isKingInCheck(boardState, movingPlayerColor, playerKingState)) {
      return false;
    }

    return true;
  }

  public checkGameEndState(boardState: BoardState, player: Player): GameEndState {
    const { figuresState } = boardState;
    const enemyColor = player.getEnemyColor();
    const enemyKingState = figuresState.find(
      (figure) => figure.name === FigureName.KING && figure.color === enemyColor,
    );

    if (!enemyKingState) {
      throw new KingNotFound();
    }

    const enemyInCheck = this.kingCheck.isKingInCheck(boardState, enemyColor, enemyKingState);

    if (enemyInCheck) {
      return {
        win: true,
        draw: false,
        winner: player,
      };
    }

    return {
      win: false,
      draw: true,
      winner: null,
    };
  }
}
