import type { FigureColor, FigureName } from "@/domain/enums";
import type { Coordinates } from "@/domain/value-objects/Coordinates";

export type GameStateContext = {
    board: DrawBoardState;
    fields: DrawField[];
    possibleMovesPositions: DrawField[];
    startNewGame: () => Promise<void>;
    clearPossibleMoves: () => void;
    selectFigureToMove: (x: number, y: number, color: FigureColor) => Promise<void>;
    playerFigureMove: (from: Coordinates, to: Coordinates, color: FigureColor) => Promise<MoveEvent[]>;
    promotion: (playerColor: FigureColor, figureName: FigureName) => Promise<void>;
    checkGameEnd: (color: FigureColor) => Promise<DrawGameEnd | null>;
}

export type MoveEvent = "promotion" | "gameEndCheck";

export type DrawGameEnd = {
    win: boolean;
    draw: boolean;
    winner: FigureColor | null;
}

export type GameState = {
}

export type DrawField = {
    x: number;
    y: number;
}

export type SelectedFigure = DrawField & { color: FigureColor };

export type DrawBoardState = {
    figures: Figure[];
    fields: DrawField[];
}

export type Figure = {
    x: number;
    y: number;
    color: FigureColor;
    name: FigureName;
}