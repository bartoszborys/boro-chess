import type { Board } from "@/domain/entities/CheesBoard";
import type { Figure } from "@/domain/entities/CheesFigure";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import type { BoardFieldState, ValidatedMoveContext } from "@/domain/dtos";
import { Movement } from "@/domain/value-objects/Movement";
import { FigureInvalidMove, FigureMoveCollision } from "@/domain/exceptions";
import { FigureName } from "@/domain/enums";
import { Coordinates, CoordinatesKey } from "../value-objects/Coordinates";
import type { Direction } from "../value-objects/Direction";

export interface MoveAnalyzer {
  createValidatedMoveContextOrThrow(board: Board, movement: Movement): ValidatedMoveContext;
  createValidatedMoveContextOrNull(board: Board, movement: Movement): ValidatedMoveContext | null;
  createPossibleMoves(board: Board, from: Coordinates): CoordinatesKey[];
}

export class CheesMoveAnalyzer implements MoveAnalyzer {
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

    const allDirections = movingFigure?.getDirections() ?? [];
    const capturing = !!targetFigure;

    const directionConditions = {
      capturing,
      hasMoved: movingFigure.hasMoved(),
    };

    const direction = allDirections.find((direction) => direction.matches(movement, directionConditions));

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
      if (direction.whenStartingPosition && figure.hasMoved()) {
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
