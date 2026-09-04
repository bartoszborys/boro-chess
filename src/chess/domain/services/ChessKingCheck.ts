import type { PathGenerator } from "@/core/domain/services/PathGenerator";
import { FigureColor } from "@/core/domain/enums";
import type { BoardFigureState, BoardState } from "@/core/domain/dtos";
import type { CoordinatesKey } from "@/core/domain/value-objects/Coordinates";
import type { ChessCheckRule } from "@/chess/domain/entities/rules/CheckRule";

export type KingCheck = {
  isKingInCheck(boardState: BoardState, kingColor: FigureColor, kingState: BoardFigureState): boolean;
};

export class ChessKingCheck implements KingCheck {
  constructor(
    private readonly pathGenerator: PathGenerator,
    private readonly checkRules: ChessCheckRule[],
  ) {}

  public isKingInCheck(boardState: BoardState, kingColor: FigureColor, kingState: BoardFigureState): boolean {
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
      if (!checkRule.canApplyToColor(kingColor)) {
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

        if (possiblyCheckFigureState.color === kingColor) {
          continue;
        }

        if (checkRule.handlesFigure(possiblyCheckFigureState.name)) {
          return true;
        }
      }
    }

    return false;
  }
}
