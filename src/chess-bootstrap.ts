import { BoardFactory } from "./application/factories/BoardFactory";
import { NewCheesGameUseCase } from "./application/use-cases/NewGame.use-case";
import { PlayerFigureMoveUseCase } from "./application/use-cases/PlayerFigureMove.use-case";
import { CheesGame } from "./domain/entities/CheesGame";
import { MoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { PathGenerator } from "./domain/services/PathGenerator";
import { CheesPathGenerator } from "./domain/services/PathGenerator";
import { CheesMoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { ChessGameRulesValidator, type GameRulesValidator } from "./domain/services/GameRules";
import { RenderBoard } from "./ui/RenderBoard";
import { InAppMemoryCheesBoardFactory } from "./infrastructure/InAppMemoryCheesBoardFactory";
import { FigureColor, FigureName } from "./domain/enums";
import { ByBehaviorCheckRule } from "./domain/entities/rules/ByBehaviorCheckRule";
import { ChessBoardSettings } from "./domain/BoardSettings";
import {
  BishopBehavior,
  BlackPawnBehavior,
  HorseBehavior,
  KingBehavior,
  TowerBehavior,
  WhitePawnBehavior,
} from "@/domain";
import { ChessPromotionRule } from "./domain/entities/rules/PromotionRule";
import { ConsolePromotionChoice } from "./ui/ConsolePromotionChoice";
import { ChessFigureBehaviorFactory } from "./application/factories/FigureBehaviorFactory";
import { FigurePromotionUseCase } from "./application/use-cases/Promotion.use-case";

const boardSettings = new ChessBoardSettings();
export const pathGenerator: PathGenerator = new CheesPathGenerator();
export const figureBehaviorFactory = new ChessFigureBehaviorFactory();
export const game = new CheesGame(figureBehaviorFactory);

const checkRules = [
  new ByBehaviorCheckRule([FigureName.BISHOP, FigureName.QUEEN], new BishopBehavior()),
  new ByBehaviorCheckRule([FigureName.TOWER, FigureName.QUEEN], new TowerBehavior()),
  new ByBehaviorCheckRule([FigureName.HORSE], new HorseBehavior()),
  new ByBehaviorCheckRule([FigureName.PAWN], new BlackPawnBehavior(), FigureColor.WHITE),
  new ByBehaviorCheckRule([FigureName.PAWN], new WhitePawnBehavior(), FigureColor.BLACK),
  new ByBehaviorCheckRule([FigureName.KING], new KingBehavior()),
];

const promotionRules = [
  new ChessPromotionRule(boardSettings),
];

export const boardFactory: BoardFactory = new InAppMemoryCheesBoardFactory(boardSettings);
export const moveAnalyzer: MoveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
export const gameRules: GameRulesValidator = new ChessGameRulesValidator(pathGenerator, checkRules, promotionRules);
export const newGameUseCase = new NewCheesGameUseCase(boardFactory);
export const playerFigureMoveUseCase = new PlayerFigureMoveUseCase(moveAnalyzer, boardFactory, game, gameRules);
export const promotionUseCase = new FigurePromotionUseCase(game, figureBehaviorFactory);
export const renderBoard = new RenderBoard(boardFactory);
export const consolePromotionChoice = new ConsolePromotionChoice();