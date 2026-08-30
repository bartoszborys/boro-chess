export type { Board } from "./entities/CheesBoard";
export type { Figure } from "./entities/CheesFigure";
export type { Game } from "./entities/CheesGame";
export type { PathGenerator, PathGenerationOptions } from "./services/PathGenerator";
export type { MoveAnalyzer } from "./services/MoveAnalyzer";
export type { GameRulesValidator as GameRules } from "./services/GameRules";
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
