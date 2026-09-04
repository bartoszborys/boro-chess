import type { BoardRepository } from "@/core/application/repositories/BoardRepository";
import type { GameRepository } from "@/core/application/repositories/GameRepository";
import { CheckGameEndUseCase } from "@/core/application/use-cases/CheckGameEnd.use-case";
import { PlayerFigureMoveUseCase } from "@/core/application/use-cases/PlayerFigureMove.use-case";
import { FigurePromotionUseCase } from "@/core/application/use-cases/Promotion.use-case";
import { SelectFigureToMoveUseCase } from "@/core/application/use-cases/SelectFigureToMove.use-case";
import { FigureColor, FigureName } from "@/core/domain/enums";
import type { GameRules } from "@/core/domain/services/GameRules";
import type { MoveAnalyzer } from "@/core/domain/services/MoveAnalyzer";
import type { MoveMaker } from "@/core/domain/services/MoveMaker";
import type { PathGenerator } from "@/core/domain/services/PathGenerator";
import { ChessFigureBehaviorFactory } from "@/chess/application/factories/ChessFigureBehaviorFactory";
import { NewChessGameUseCase } from "@/chess/application/use-cases/NewGame.use-case";
import { BishopBehavior } from "@/chess/domain/entities/behaviors/BishopBehavior";
import { BlackPawnBehavior } from "@/chess/domain/entities/behaviors/BlackPawnBehavior";
import { KingBehavior } from "@/chess/domain/entities/behaviors/KingBehavior";
import { KnightBehavior } from "@/chess/domain/entities/behaviors/KnightBehavior";
import { RookBehavior } from "@/chess/domain/entities/behaviors/RookBehavior";
import { WhitePawnBehavior } from "@/chess/domain/entities/behaviors/WhitePawnBehavior";
import { ByBehaviorCheckRule } from "@/chess/domain/entities/rules/ByBehaviorCheckRule";
import { ChessPromotionRule } from "@/chess/domain/entities/rules/PromotionRule";
import { ChessBoardSettings } from "@/chess/domain/services/ChessBoardSettings";
import { ChessGameRules } from "@/chess/domain/services/ChessGameRules";
import { ChessKingCheck } from "@/chess/domain/services/ChessKingCheck";
import { ChessMoveAnalyzer } from "@/chess/domain/services/ChessMoveAnalyzer";
import { ChessMoveMaker } from "@/chess/domain/services/ChessMoveMaker";
import { GridPathGenerator } from "@/core/domain/services/GridPathGenerator";
import { CoreMoveMaker } from "@/core/domain/services/CoreMoveMaker";
import { ChessInAppMemoryBoardRepository } from "@/chess/infrastructure/ChessInAppMemoryBoardRepository";
import { ChessInAppMemoryGameRepository } from "@/chess/infrastructure/ChessInAppMemoryGameRepository";
import type { NewGameUseCase } from "@/core/application/use-cases/NewGame.use-case";

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
export const pathGenerator: PathGenerator = new GridPathGenerator();
export const figureBehaviorFactory = new ChessFigureBehaviorFactory();
export const moveMaker: MoveMaker = new ChessMoveMaker(new CoreMoveMaker(), figureBehaviorFactory);
export const moveAnalyzer: MoveAnalyzer = new ChessMoveAnalyzer(pathGenerator);
export const gameRules: GameRules = new ChessGameRules(new ChessKingCheck(pathGenerator, checkRules), promotionRules);

// Infrastructures - application repositories
export const gameRepository: GameRepository = new ChessInAppMemoryGameRepository();
export const boardRepository: BoardRepository = new ChessInAppMemoryBoardRepository(boardSettings);

// Application
export const newGameUseCase: NewGameUseCase = new NewChessGameUseCase(boardRepository, boardSettings);
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
