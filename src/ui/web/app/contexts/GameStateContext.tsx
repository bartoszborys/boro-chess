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
  gameRepository,
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

const readCurrentPlayer = (): Player => gameRepository.getGame().getCurrentPlayer();
const readPlayers = (): Record<FigureColor, Player> => gameRepository.getPlayers();

export const OfflineGameStateProvider = ({ children }: OfflineGameStateProviderProps) => {
  const [board, setBoard] = useState<DrawBoardState>(createInitialBoard);
  const [fields] = useState<DrawField[]>(createInitialFields);
  const [possibleMovesPositions, setPossibleMovesPositions] = useState<DrawField[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(readCurrentPlayer);
  const [players, setPlayers] = useState<Record<FigureColor, Player>>(readPlayers);

  const updatePlayers = useCallback(() => {
    setPlayers({ ...readPlayers() });
  }, []);

  const updateCurrentBoardState = useCallback(() => {
    setBoard((prev) => ({ ...prev, figures: readFigures() }));
  }, []);

  const syncCurrentPlayer = useCallback(() => {
    setCurrentPlayer(readCurrentPlayer());
  }, []);

  const clearPossibleMoves = useCallback(() => {
    setPossibleMovesPositions([]);
  }, []);

  const startNewGame = useCallback(async () => {
    newGameUseCase.execute();
    setPossibleMovesPositions([]);
    updateCurrentBoardState();
    syncCurrentPlayer();
    updatePlayers();
  }, [syncCurrentPlayer, updateCurrentBoardState]);

  const selectFigureToMove = useCallback(
    async (x: number, y: number) => {
      const possibleMoves = selectFigureToMoveUseCase.execute(new Coordinates(x, y), currentPlayer.color);
      setPossibleMovesPositions(
        possibleMoves.map((move) => {
          const coordinates = Coordinates.fromKey(move);
          return { x: coordinates.x, y: coordinates.y };
        }),
      );
    },
    [currentPlayer],
  );

  const playerFigureMove = useCallback(
    async (from: Coordinates, to: Coordinates): Promise<MoveEvent[]> => {
      const moveResult = playerFigureMoveUseCase.execute(new Movement(from, to), currentPlayer);
      setPossibleMovesPositions([]);
      updateCurrentBoardState();

      if (moveResult.promotion) {
        return ["promotion", "gameEndCheck"];
      }

      syncCurrentPlayer();
      updatePlayers();
      return ["gameEndCheck"];
    },
    [currentPlayer, syncCurrentPlayer, updateCurrentBoardState],
  );

  const promotion = useCallback(
    async (player: Player, figureName: FigureName) => {
      promotionUseCase.execute(player, figureName);
      updateCurrentBoardState();
      syncCurrentPlayer();
      updatePlayers();
    },
    [updateCurrentBoardState],
  );

  const checkGameEnd = useCallback(async (player: Player): Promise<DrawGameEnd | null> => {
    const gameEnd = checkGameEndUseCase.execute(player);
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
        currentPlayer,
        startNewGame,
        clearPossibleMoves,
        selectFigureToMove,
        playerFigureMove,
        promotion,
        checkGameEnd,
        players,
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
