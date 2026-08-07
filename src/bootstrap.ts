import { BoardFactory } from "./application/factories/BoardFactory";
import { NewCheesGameUseCase } from "./application/use-cases/NewGame.use-case";
import { PlayerFigureMoveUseCase } from "./application/use-cases/PlayerFigureMove.use-case";
import { CheesGame } from "./domain/entities/CheesGame";
import { MoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { PathGenerator } from "./domain/services/PathGenerator";
import { CheesPathGenerator } from "./domain/services/PathGenerator";
import { CheesMoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { RenderBoard } from "./ui/RenderBoard";
import { InAppMemoryCheesBoardFactory } from "./infrastructure/InAppMemoryCheesBoardFactory";

export const pathGenerator: PathGenerator = new CheesPathGenerator();
export const game = new CheesGame();

export const boardFactory: BoardFactory = new InAppMemoryCheesBoardFactory();
export const moveAnalyzer: MoveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
export const newGameUseCase = new NewCheesGameUseCase(boardFactory);
export const playerFigureMoveUseCase = new PlayerFigureMoveUseCase(moveAnalyzer, boardFactory, game);
export const renderBoard = new RenderBoard(boardFactory);
