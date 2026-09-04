import { KingNotFound } from "@/core/domain/exceptions";
import { FigureColor, FigureName } from "@/core/domain/enums";
import type { BoardState, GameEndState } from "@/core/domain/dtos";
import type { Player } from "@/core/domain/entities/Player";
import type { PromotionRule } from "@/core/domain/entities/rules/PromotionRule";
import type { KingCheck } from "@/chess/domain/services/ChessKingCheck";
import type { GameRules } from "@/core/domain/services/GameRules";

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
