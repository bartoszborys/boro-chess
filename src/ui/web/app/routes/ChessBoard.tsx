import { FigureColor, FigureName } from "@/domain/enums";
import { useCallback, useRef, useState } from "react";
import { ChessPiece } from "~/components/ChessPiece";
import { useGameState } from "~/contexts/GameStateContext";
import type { Figure, MoveEvent, SelectedFigure } from "~/dtos";
import { Coordinates } from "@/domain/value-objects/Coordinates";

type PieceMoveAnimation = {
  id: number;
  x: number;
  y: number;
  vector: { x: number; y: number };
};

const PIECE_MOVE_FALLBACK_MS = 280;

const parsePromotionChoice = (raw: string | null): FigureName => {
  switch (raw?.trim().toLowerCase()) {
    case FigureName.ROOK:
      return FigureName.ROOK;
    case FigureName.BISHOP:
      return FigureName.BISHOP;
    case FigureName.KNIGHT:
      return FigureName.KNIGHT;
    default:
      return FigureName.QUEEN;
  }
};

const ChessBoard = () => {
  const {
    board,
    fields,
    possibleMovesPositions,
    startNewGame,
    selectFigureToMove,
    playerFigureMove,
    promotion,
    checkGameEnd,
    clearPossibleMoves,
    currentTurn,
  } = useGameState();
  const [selectedFigure, setSelectedFigure] = useState<SelectedFigure | null>(null);
  const [pieceMove, setPieceMove] = useState<PieceMoveAnimation | null>(null);
  const pieceMoveDoneRef = useRef<(() => void) | null>(null);
  const pieceMoveIdRef = useRef(0);

  const waitForPieceMove = useCallback(() => {
    return new Promise<void>((resolve) => {
      let settled = false;
      let timeoutId = 0;
      const finish = () => {
        if (settled) {
          return;
        }
        settled = true;
        window.clearTimeout(timeoutId);
        pieceMoveDoneRef.current = null;
        setPieceMove(null);
        resolve();
      };

      pieceMoveDoneRef.current = finish;
      timeoutId = window.setTimeout(finish, PIECE_MOVE_FALLBACK_MS);
    });
  }, []);

  const finishPieceMove = useCallback(() => {
    pieceMoveDoneRef.current?.();
  }, []);

  const isPossibleMove = useCallback(
    (x: number, y: number) => possibleMovesPositions.some((field) => field.x === x && field.y === y),
    [possibleMovesPositions],
  );

  const handlePromotion = useCallback(
    async (color: FigureColor) => {
      const choice = window.prompt("Promote to (queen, rook, bishop, knight)", FigureName.QUEEN);
      await promotion(color, parsePromotionChoice(choice));
    },
    [promotion],
  );

  const handleGameEndCheck = useCallback(
    async (color: FigureColor) => {
      const gameEnd = await checkGameEnd(color);
      if (gameEnd?.win) {
        if (gameEnd.winner) {
          window.alert(`${gameEnd.winner} won`);
        }
      }
      if (gameEnd?.draw) {
        window.alert("Draw");
      }
    },
    [checkGameEnd],
  );

  const moveEventHandlers: Record<MoveEvent, (color: FigureColor) => Promise<void>> = {
    promotion: handlePromotion,
    gameEndCheck: handleGameEndCheck,
  };

  const dispatchMoveEvents = useCallback(
    async (events: MoveEvent[], color: FigureColor) => {
      for (const event of events) {
        await moveEventHandlers[event](color);
      }
    },
    [handleGameEndCheck, handlePromotion],
  );

  const drawCellColor = useCallback(
    (x: number, y: number) => {
      if (isPossibleMove(x, y)) {
        return "bg-[#8a9a52]";
      }
      if ((y % 2 === 0 && x % 2 === 0) || (y % 2 !== 0 && x % 2 !== 0)) {
        return "bg-[#5c4632]";
      }
      return "bg-[#cbb892]";
    },
    [isPossibleMove],
  );

  const onCellClick = useCallback(
    async (x: number, y: number) => {
      if (pieceMove) {
        return;
      }

      if (selectedFigure && isPossibleMove(x, y)) {
        pieceMoveIdRef.current += 1;
        setPieceMove({
          id: pieceMoveIdRef.current,
          x,
          y,
          vector: {
            x: selectedFigure.x - x,
            y: selectedFigure.y - y,
          },
        });
        const moving = waitForPieceMove();
        const events = await playerFigureMove(
          new Coordinates(selectedFigure.x, selectedFigure.y),
          new Coordinates(x, y),
        );
        setSelectedFigure(null);
        await moving;
        await dispatchMoveEvents(events, currentTurn.color);
        return;
      }

      const figure = board.figures.find((item: Figure) => item.x === x && item.y === y);
      if (figure) {
        await selectFigureToMove(x, y, currentTurn.color);
        setSelectedFigure({ x, y, color: figure.color });
        return;
      }

      setSelectedFigure(null);
      clearPossibleMoves();
    },
    [
      board.figures,
      clearPossibleMoves,
      currentTurn,
      dispatchMoveEvents,
      isPossibleMove,
      pieceMove,
      playerFigureMove,
      selectFigureToMove,
      selectedFigure,
      waitForPieceMove,
    ],
  );

  const drawCell = useCallback(
    (x: number, y: number) => {
      const figure = board.figures.find((item: Figure) => item.x === x && item.y === y);
      const movingHere = pieceMove?.x === x && pieceMove?.y === y;
      return (
        <button
          type="button"
          key={`${x}-${y}`}
          onClick={() => onCellClick(x, y)}
          className={`chess-square overflow-visible border border-[#3d2e1f] flex items-center justify-center ${drawCellColor(x, y)} ${movingHere ? "relative z-10" : ""}`}
        >
          {figure ? (
            <ChessPiece
              key={movingHere && pieceMove ? pieceMove.id : `${figure.color}-${figure.name}`}
              color={figure.color}
              name={figure.name}
              fromCurrent={movingHere && pieceMove ? pieceMove.vector : null}
              onMoveEnd={movingHere ? finishPieceMove : undefined}
            />
          ) : null}
        </button>
      );
    },
    [board.figures, drawCellColor, finishPieceMove, onCellClick, pieceMove],
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center bg-[#FFFFFF] p-6 rounded-md">
        <p className="mb-3 text-sm text-[#3d2e1f]">
          Current turn: <span className="font-medium capitalize">{currentTurn.color}</span>
        </p>
        <div className="chess-board grid grid-cols-8 grid-rows-8 border-2 border-[#3d2e1f]">
          {fields.map((field) => drawCell(field.x, field.y))}
        </div>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setSelectedFigure(null);
            setPieceMove(null);
            startNewGame();
          }}
        >
          Start New Game
        </button>
      </div>
    </>
  );
};

export default ChessBoard;
