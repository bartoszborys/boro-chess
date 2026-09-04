import type { BoardRepository } from "./application/repositories/BoardRepository";
import { NewChessGameUseCase } from "./application/use-cases/NewGame.use-case";
import { PlayerFigureMoveUseCase } from "./application/use-cases/PlayerFigureMove.use-case";
import { ChessMoveMaker, type MoveMaker } from "./domain/services/MoveMaker";
import { ChessMoveAnalyzer, type MoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { ChessPathGenerator, type PathGenerator } from "./domain/services/PathGenerator";
import { ChessGameRules, type GameRules } from "./domain/services/GameRules";
import { InAppMemoryBoardRepository } from "./infrastructure/InAppMemoryBoardRepository";
import { InAppMemoryGameRepository } from "./infrastructure/InAppMemoryGameRepository";
import { FigureColor, FigureName } from "./domain/enums";
import { ByBehaviorCheckRule } from "./domain/entities/rules/ByBehaviorCheckRule";
import { ChessBoardSettings } from "./domain/services/BoardSettings";
import { BishopBehavior } from "@/domain/entities/behaviors/BishopBehavior";
import { BlackPawnBehavior } from "@/domain/entities/behaviors/BlackPawnBehavior";
import { KingBehavior } from "@/domain/entities/behaviors/KingBehavior";
import { KnightBehavior } from "@/domain/entities/behaviors/KnightBehavior";
import { RookBehavior } from "@/domain/entities/behaviors/RookBehavior";
import { WhitePawnBehavior } from "@/domain/entities/behaviors/WhitePawnBehavior";
import { ChessPromotionRule } from "./domain/entities/rules/PromotionRule";
import { ChessFigureBehaviorFactory } from "./application/factories/FigureBehaviorFactory";
import { FigurePromotionUseCase } from "./application/use-cases/Promotion.use-case";
import { CheckGameEndUseCase } from "./application/use-cases/CheckGameEnd.use-case";
import { SelectFigureToMoveUseCase } from "./application/use-cases/SelectFigureToMove.use-case";
import type { GameRepository } from "./application/repositories/GameRepository";

//Domain
export const boardSettings = new ChessBoardSettings();
const promotionRules = [new ChessPromotionRule(boardSettings)];
const checkRules = [
  new ByBehaviorCheckRule([FigureName.BISHOP, FigureName.QUEEN], new BishopBehavior()),
  new ByBehaviorCheckRule([FigureName.ROOK, FigureName.QUEEN], new RookBehavior()),
  new ByBehaviorCheckRule([FigureName.KNIGHT], new KnightBehavior()),
  new ByBehaviorCheckRule([FigureName.PAWN], new BlackPawnBehavior(), FigureColor.WHITE),
  new ByBehaviorCheckRule([FigureName.PAWN], new WhitePawnBehavior(), FigureColor.BLACK),
  new ByBehaviorCheckRule([FigureName.KING], new KingBehavior()),
];
export const pathGenerator: PathGenerator = new ChessPathGenerator();
export const figureBehaviorFactory = new ChessFigureBehaviorFactory();
export const moveMaker: MoveMaker = new ChessMoveMaker(figureBehaviorFactory);
export const moveAnalyzer: MoveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
export const gameRules: GameRules = new ChessGameRules(pathGenerator, checkRules, promotionRules);

// Infrastructures - application repositories
export const gameRepository: GameRepository = new InAppMemoryGameRepository();
export const boardRepository: BoardRepository = new InAppMemoryBoardRepository(boardSettings);

// Application
export const newGameUseCase = new NewChessGameUseCase(boardRepository, boardSettings);
export const selectFigureToMoveUseCase = new SelectFigureToMoveUseCase(
  boardRepository,
  moveAnalyzer,
  moveMaker,
  gameRules,
);
export const playerFigureMoveUseCase = new PlayerFigureMoveUseCase(
  moveAnalyzer,
  boardRepository,
  gameRepository,
  moveMaker,
  gameRules,
);
export const checkGameEndUseCase = new CheckGameEndUseCase(moveAnalyzer, boardRepository, moveMaker, gameRules);
export const promotionUseCase = new FigurePromotionUseCase(
  boardRepository,
  gameRepository,
  figureBehaviorFactory,
  moveMaker,
);
