import type { Board } from "@/core/domain/entities/Board";
import type { Figure } from "@/core/domain/entities/Figure";
import type { PathGenerator } from "@/core/domain/services/PathGenerator";
import type { BoardFieldState, ValidatedMoveContext } from "@/core/domain/dtos";
import { Movement } from "@/core/domain/value-objects/Movement";
import { FigureInvalidMove, FigureMoveCollision } from "@/core/domain/exceptions";
import { FigureName } from "@/core/domain/enums";
import { Coordinates, type CoordinatesKey } from "@/core/domain/value-objects/Coordinates";
import type { Direction } from "@/core/domain/value-objects/Direction";
import type { MoveAnalyzer } from "@/core/domain/services/MoveAnalyzer";

export class ChessMoveAnalyzer implements MoveAnalyzer {
  constructor(private readonly pathGenerator: PathGenerator) {}

  public createValidatedMoveContextOrThrow(board: Board, movement: Movement): ValidatedMoveContext {
    const context = this.createValidatedMoveContextOrNull(board, movement);

    if (!context) {
      throw new FigureInvalidMove(`Figure cannot move from ${movement.from} to ${movement.to}`);
    }

    return context;
  }

  public createValidatedMoveContextOrNull(board: Board, movement: Movement): ValidatedMoveContext | null {
    const { from, to } = movement;

    const movingFigure = board.getFigureByCoordinatesOrThrow(from);
    const targetFigure = board.getFigureByCoordinates(to);

    if (movingFigure.isFriendly(targetFigure)) {
      throw new FigureInvalidMove(`Figure cannot capture friendly figure`);
    }

    const allDirections = movingFigure.getDirections();
    const capturing = !!targetFigure;
    const hasMoved = movingFigure.hasMoved();
    const direction = allDirections.find(
      (candidate) => this.matchesConditions(candidate, capturing, hasMoved) && candidate.matches(movement),
    );

    if (!direction) {
      return null;
    }

    if (direction.castling && capturing) {
      throw new FigureInvalidMove(`Cannot castle and capture at the same time`);
    }

    const path = this.pathGenerator.forVectorMovementWithoutTarget({
      movement,
      stepVector: direction,
    });

    if (board.anyFigureOnCoordinates(path)) {
      throw new FigureMoveCollision();
    }

    if (direction.castling) {
      const expectedCastlingable = to.addVector(direction);
      const castlingableFigure = board.getFigureByCoordinatesOrThrow(expectedCastlingable);
      this.assertCanCastle(castlingableFigure, movingFigure);
      const castlingMovement = new Movement(expectedCastlingable, to.subtractVector(direction));

      return {
        movement,
        capturing,
        castlingMovement,
      };
    }

    return {
      movement,
      capturing,
    };
  }

  public createPossibleMoves(board: Board, from: Coordinates): CoordinatesKey[] {
    const figure = board.getFigureByCoordinatesOrThrow(from);
    const boardFieldsState = board.getFieldsState(figure.getColor());
    const fieldsByKey = this.mapFieldsByKey(boardFieldsState);
    const existingFields = boardFieldsState.map((field) => field.coordinatesKey);

    const availableFields: Coordinates[] = [];

    for (const direction of figure.getDirections()) {
      if (!this.matchesConditions(direction, false, figure.hasMoved())) {
        continue;
      }

      const trajectory = this.pathGenerator.forDirectionOnExistingFields({
        from,
        direction,
        existingFields,
      });

      for (const coordinate of trajectory) {
        const field = fieldsByKey[coordinate.toKey()];

        if (!this.canEnterField(direction, field)) {
          break;
        }

        availableFields.push(coordinate);

        if (field.occupied && field.canCapture) {
          break;
        }
      }
    }

    return availableFields.map((field) => field.toKey());
  }

  private matchesConditions(direction: Direction, capturing: boolean, hasMoved: boolean): boolean {
    if (capturing && !direction.canCapture) {
      return false;
    }

    if (direction.whenStartingPosition && hasMoved) {
      return false;
    }

    return true;
  }

  private canEnterField(direction: Direction, field: BoardFieldState): boolean {
    if (direction.whenEnemy && !field.canCapture) {
      return false;
    }

    if (field.occupied && (!field.canCapture || !direction.canCapture)) {
      return false;
    }

    return true;
  }

  private mapFieldsByKey(boardFieldsState: BoardFieldState[]): Record<CoordinatesKey, BoardFieldState> {
    const fieldsByKey: Record<CoordinatesKey, BoardFieldState> = {};
    for (const field of boardFieldsState) {
      fieldsByKey[field.coordinatesKey] = field;
    }
    return fieldsByKey;
  }

  private assertCanCastle(castlingableFigure: Figure, movingFigure: Figure): void {
    if (castlingableFigure.getName() !== FigureName.ROOK) {
      throw new FigureInvalidMove(`Cannot be castled by not a rook`);
    }

    if (!movingFigure.isFriendly(castlingableFigure)) {
      throw new FigureInvalidMove(`Cannot be castled by not a friendly figure`);
    }

    if (castlingableFigure.hasMoved()) {
      throw new FigureInvalidMove(`Cannot be castled by a figure that has already moved`);
    }
  }
}
