export type { Board } from "./entities/ChessBoard";
export type { Figure } from "./entities/ChessFigure";
export type { Game } from "./entities/ChessGame";
export type { PathGenerator, PathGenerationOptions } from "./services/PathGenerator";
export type { MoveAnalyzer } from "./services/MoveAnalyzer";
export type { MoveMaker as MoveApplier } from "./services/MoveMaker";
export type { GameRules } from "./services/GameRules";
export type { FigureBehavior } from "./entities/behaviors/FigureBehavior";

export {
  BishopBehavior,
  KnightBehavior,
  RookBehavior,
  QueenBehavior,
  KingBehavior,
  WhitePawnBehavior,
  BlackPawnBehavior,
} from "./entities/behaviors";

export { Movement } from "./value-objects/Movement";
