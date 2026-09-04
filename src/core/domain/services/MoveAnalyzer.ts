import type { Board } from "@/core/domain/entities/Board";
import type { ValidatedMoveContext } from "@/core/domain/dtos";
import type { Coordinates, CoordinatesKey } from "@/core/domain/value-objects/Coordinates";
import type { Movement } from "@/core/domain/value-objects/Movement";

export interface MoveAnalyzer {
  createValidatedMoveContextOrThrow(board: Board, movement: Movement): ValidatedMoveContext;
  createValidatedMoveContextOrNull(board: Board, movement: Movement): ValidatedMoveContext | null;
  createPossibleMoves(board: Board, from: Coordinates): CoordinatesKey[];
}
