import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { DrawBoardState, DrawField, DrawGameEnd, Figure, GameStateContext, MoveEvent } from "../dtos";
import {
  newGameUseCase,
  selectFigureToMoveUseCase,
  playerFigureMoveUseCase,
  checkGameEndUseCase,
  promotionUseCase,
  boardRepository,
  boardSettings,
} from "@/chess-bootstrap";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { Player } from "@/domain/entities/Player";
import { FigureColor, FigureName } from "@/domain/enums";
import { Movement } from "@/domain/value-objects/Movement";

export const OfflineGameStateContext = createContext<GameStateContext | null>(null);

type OfflineGameStateProviderProps = Readonly<{
  children: ReactNode;
}>;

const readFigures = (): Figure[] =>
  boardRepository
    .getBoardState()
    .getFiguresState()
    .map((figure) => ({
      x: figure.coordinates.x,
      y: figure.coordinates.y,
      color: figure.color,
      name: figure.name,
    }));

const createInitialBoard = (): DrawBoardState => ({
  figures: [],
  fields: [],
});

const createInitialFields = () => {
  const [sizeX, sizeY] = boardSettings.getBoardSize();
  return Array.from({ length: sizeX * sizeY }, (_, index) => ({
    x: (index % sizeX) + 1,
    y: Math.floor(index / sizeX) + 1,
  }));
};

const mapMoveResultToEvents = (promotion: boolean): MoveEvent[] => {
  if (promotion) {
    return ["promotion", "gameEndCheck"];
  }

  return ["gameEndCheck"];
};

export const OfflineGameStateProvider = ({ children }: OfflineGameStateProviderProps) => {
  const [board, setBoard] = useState<DrawBoardState>(createInitialBoard);
  const [fields] = useState<DrawField[]>(createInitialFields);
  const [possibleMovesPositions, setPossibleMovesPositions] = useState<DrawField[]>([]);

  const updateCurrentBoardState = useCallback(() => {
    setBoard((prev) => ({ ...prev, figures: readFigures() }));
  }, []);

  const clearPossibleMoves = useCallback(() => {
    setPossibleMovesPositions([]);
  }, []);

  const startNewGame = useCallback(async () => {
    newGameUseCase.execute();
    setPossibleMovesPositions([]);
    updateCurrentBoardState();
  }, [updateCurrentBoardState]);

  const selectFigureToMove = useCallback(async (x: number, y: number, color: FigureColor) => {
    const possibleMoves = selectFigureToMoveUseCase.execute(new Coordinates(x, y), color);
    setPossibleMovesPositions(
      possibleMoves.map((move) => {
        const coordinates = Coordinates.fromKey(move);
        return { x: coordinates.x, y: coordinates.y };
      }),
    );
  }, []);

  const playerFigureMove = useCallback(
    async (from: Coordinates, to: Coordinates, color: FigureColor) => {
      const player = new Player(color);
      const moveResult = playerFigureMoveUseCase.execute(new Movement(from, to), player);
      setPossibleMovesPositions([]);
      updateCurrentBoardState();
      return mapMoveResultToEvents(moveResult.promotion);
    },
    [updateCurrentBoardState],
  );

  const promotion = useCallback(
    async (playerColor: FigureColor, figureName: FigureName) => {
      promotionUseCase.execute(new Player(playerColor), figureName);
      updateCurrentBoardState();
    },
    [updateCurrentBoardState],
  );

  const checkGameEnd = useCallback(async (color: FigureColor): Promise<DrawGameEnd | null> => {
    const gameEnd = checkGameEndUseCase.execute(new Player(color));
    if (!gameEnd) {
      return null;
    }

    return {
      win: gameEnd.win,
      draw: gameEnd.draw,
      winner: gameEnd.winner?.color ?? null,
    };
  }, []);

  return (
    <OfflineGameStateContext.Provider
      value={{
        board,
        fields,
        possibleMovesPositions,
        startNewGame,
        clearPossibleMoves,
        selectFigureToMove,
        playerFigureMove,
        promotion,
        checkGameEnd,
      }}
    >
      {children}
    </OfflineGameStateContext.Provider>
  );
};

export const useGameState = () => {
  const context = useContext(OfflineGameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a OfflineGameStateProvider");
  }
  return context;
};
