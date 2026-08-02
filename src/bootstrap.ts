import { BoardFactory } from "./application/factories/BoardFactory";
import { NewGameUseCase } from "./application/use-cases/NewGame.use-case";
import { PlayerFigureMoveUseCase } from "./application/use-cases/PlayerFigureMove.use-case";
import { CheesGame } from "./domain/entities/CheesGame";
import { MoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { PathGenerator } from "./domain/services/PathGenerator";
import { CheesPathGenerator } from "./domain/services/PathGenerator";
import { CheesMoveAnalyzer } from "./domain/services/MoveAnalyzer";
import { RenderBoard } from "./ui/RenderBoard";
import { InAppMemoryBoardFactory } from "./infrastructure/InMemoryBoardFactory";

export const boardFactory: BoardFactory = new InAppMemoryBoardFactory();
export const pathGenerator: PathGenerator = new CheesPathGenerator();
export const game = new CheesGame();

export const moveAnalyzer: MoveAnalyzer = new CheesMoveAnalyzer(pathGenerator);
export const newGameUseCase = new NewGameUseCase(boardFactory);
export const playerFigureMoveUseCase = new PlayerFigureMoveUseCase(moveAnalyzer, boardFactory, game);
export const renderBoard = new RenderBoard(boardFactory.getBoardState());
