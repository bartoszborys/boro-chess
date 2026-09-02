import type { PathGenerator } from "@/domain/services/PathGenerator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { FigureColor, FigureName } from "@/domain/enums";
import type { BoardFigureState, BoardState, GameEndState } from "@/domain/dtos";
import type { CoordinatesKey } from "../value-objects/Coordinates";
import type { Player } from "@/domain/entities/Player";
import type { ChessCheckRule } from "@/domain/entities/rules/CheckRule";
import type { PromotionRule } from "@/domain/entities/rules/PromotionRule";

export type GameRules = {
  boardValidStateForPlayer(boardState: BoardState, movingPlayerColor: FigureColor): boolean;
  checkGameEndState(boardState: BoardState, player: Player): GameEndState;
  promotionAvailable(boardState: BoardState): boolean;
};

export class ChessGameRules implements GameRules {
  constructor(
    private readonly pathGenerator: PathGenerator,
    private readonly checkRules: ChessCheckRule[],
    private readonly promotionRules: PromotionRule[],
  ) { }

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
      throw new FigureInvalidMove(`Player king not found`);
    }

    if (this.isKingInCheck(boardState, movingPlayerColor, playerKingState)) {
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
      throw new FigureInvalidMove(`Player king not found`);
    }

    const enemyInCheck = this.isKingInCheck(boardState, enemyColor, enemyKingState);

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

  private isKingInCheck(boardState: BoardState, playerColor: FigureColor, kingState: BoardFigureState): boolean {
    const { figuresState, fieldsState } = boardState;
    const figuresByCoordinates = figuresState.reduce(
      (acc, state) => {
        acc[state.coordinates.toKey()] = state;
        return acc;
      },
      {} as Record<CoordinatesKey, BoardFigureState>,
    );
    const existingFields = fieldsState.map((item) => item.coordinatesKey);

    for (const checkRule of this.checkRules) {
      if (!checkRule.canApplyToColor(playerColor)) {
        continue;
      }

      const directions = checkRule.getDirections();

      for (const direction of directions) {
        if (!direction.canCapture && !direction.castling) {
          continue;
        }

        const possiblyCheckPath = this.pathGenerator.forDirectionOnExistingFields({
          from: kingState.coordinates,
          direction: direction.reverse(),
          existingFields,
        });

        let possiblyCheckFigureState: BoardFigureState | undefined;
        for (const coordinate of possiblyCheckPath) {
          const figureState = figuresByCoordinates[coordinate.toKey()];

          if (figureState) {
            possiblyCheckFigureState = figureState;
            break;
          }
        }

        if (!possiblyCheckFigureState) {
          continue;
        }

        if (possiblyCheckFigureState.color === playerColor) {
          continue;
        }

        if (checkRule.isCheck(possiblyCheckFigureState.name)) {
          return true;
        }
      }
    }

    return false;
  }
}
