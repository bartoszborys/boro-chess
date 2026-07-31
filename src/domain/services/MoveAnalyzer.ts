import type { Board } from "@/domain/entities/CheesBoard";
import type { PathGenerator } from "@/domain/services/PathGenerator";
import type { ValidatedMoveContext } from "@/domain/value-objects/ValidatedMoveContext";
import { Movement } from "@/domain/value-objects/Movement";
import {
  FigureInvalidMove,
  FigureMoveCollision,
  FigureNotFound,
} from "@/domain/exceptions";

export interface MoveAnalyzer {
  createValidatedMoveContext(board: Board, movement: Movement): ValidatedMoveContext;
}

export class CheesMoveAnalyzer implements MoveAnalyzer {
  constructor(
    private readonly pathGenerator: PathGenerator,
  ) { }

  public createValidatedMoveContext(board: Board, movement: Movement): ValidatedMoveContext {
    const { from, to } = movement;
    const movingFigure = board.getFigureByCoordinates(from);
    const targetFigure = board.getFigureByCoordinates(to);
    const allDirections = movingFigure?.getDirections() ?? [];
    const capturing = !!targetFigure;

    if (!movingFigure) {
      throw new FigureNotFound();
    }

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

    const path = this.pathGenerator.fromConcretePath({
      movement,
      vector: direction,
    });

    if (board.anyFigureOnCoordinates(path)) {
      throw new FigureMoveCollision();
    }

    return {
      capturing,
      castling: false,
    };
  }
}
