import type { Board } from "@/domain/entities/CheesBoard";
import type { Figure } from "@/domain/entities/CheesFigure";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";
import { Movement } from "@/domain/value-objects/Movement";
import {
  FigureInvalidMove,
  FigureMoveCollision,
} from "@/domain/exceptions";
import { FigureName } from "@/domain/enums";

export interface MoveAnalyzer {
  createValidatedMoveContext(board: Board, movement: Movement): ValidatedMoveContext;
}

export class CheesMoveAnalyzer implements MoveAnalyzer {
  constructor(
    private readonly pathGenerator: PathGenerator,
  ) { }

  public createValidatedMoveContext(board: Board, movement: Movement): ValidatedMoveContext {
    const { from, to } = movement;

    const movingFigure = board.getFigureByCoordinatesOrThrow(from);
    const targetFigure = board.getFigureByCoordinates(to);

    if (movingFigure.isFriendly(targetFigure)) {
      throw new FigureInvalidMove(
        `Figure cannot capture friendly figure`,
      );
    }

    const allDirections = movingFigure?.getDirections() ?? [];
    const capturing = !!targetFigure;

    const directionConditions = {
      capturing,
      hasMoved: movingFigure.hasMoved(),
    };

    const direction = allDirections.find(direction => direction.matches(movement, directionConditions));

    if (!direction) {
      throw new FigureInvalidMove(
        `Figure cannot move from ${from} to ${to}`,
      );
    }

    if (direction.castling && capturing) {
      throw new FigureInvalidMove(
        `Cannot castle and capture at the same time`,
      );
    }

    const path = this.pathGenerator.forConcreteMovement({
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

  private assertCanCastle(castlingableFigure: Figure, movingFigure: Figure): void {
    if (castlingableFigure.getName() !== FigureName.TOWER) {
      throw new FigureInvalidMove(
        `Cannot be castled by not a tower`,
      );
    }

    if (!movingFigure.isFriendly(castlingableFigure)) {
      throw new FigureInvalidMove(
        `Cannot be castled by not a friendly figure`,
      );
    }

    if (castlingableFigure.hasMoved()) {
      throw new FigureInvalidMove(
        `Cannot be castled by a figure that has already moved`,
      );
    }
  }
}
