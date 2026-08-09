import type { Board } from "@/domain/entities/CheesBoard";
import type { ChessCheckRule } from "@/domain/entities/check-rules/CheckRule";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import { FigureInvalidMove } from "@/domain/exceptions";
import { FigureColor, FigureName } from "@/domain/enums";
import type { BoardFigureState } from "@/domain/value-objects/BoardFigureState";
import { BoardFieldState } from "../value-objects/BoardFieldState";
import { CoordinatesKey } from "../value-objects/Coordinates";

export interface GameRulesValidator {
  boardValidStateForPlayer(
    figureStates: BoardFigureState[],
    fieldsState: BoardFieldState[],
    movingPlayerColor: FigureColor,
  ): boolean;
}

export class ChessGameRulesValidator implements GameRulesValidator {
  constructor(
    private readonly pathGenerator: PathGenerator,
    private readonly checkRules: ChessCheckRule[],
  ) {}

  public boardValidStateForPlayer(
    figureStates: BoardFigureState[],
    fieldsState: BoardFieldState[],
    movingPlayerColor: FigureColor,
  ): boolean {
    const playerKingState = figureStates.find(
      (figure) => figure.name === FigureName.KING && figure.color === movingPlayerColor,
    );

    if (!playerKingState) {
      throw new FigureInvalidMove(`Player king not found`);
    }

    if (this.isKingInCheck(fieldsState, figureStates, movingPlayerColor, playerKingState)) {
      return false;
    }

    return true;
  }

  private isKingInCheck(
    fieldsState: BoardFieldState[],
    figureStates: BoardFigureState[],
    playerColor: FigureColor,
    kingState: BoardFigureState,
  ): boolean {
    const figuresByCoordinates = figureStates.reduce(
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
          direction,
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
