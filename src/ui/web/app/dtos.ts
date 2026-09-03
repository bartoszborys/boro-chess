import type { FigureColor, FigureName } from "@/domain/enums";
import type { Player } from "@/domain/entities/Player";
import type { Coordinates } from "@/domain/value-objects/Coordinates";

export type GameStateContext = {
    board: DrawBoardState;
    fields: DrawField[];
    possibleMovesPositions: DrawField[];
    currentPlayer: Player;
    startNewGame: () => Promise<void>;
    clearPossibleMoves: () => void;
    selectFigureToMove: (x: number, y: number) => Promise<void>;
    playerFigureMove: (from: Coordinates, to: Coordinates) => Promise<MoveEvent[]>;
    promotion: (player: Player, figureName: FigureName) => Promise<void>;
    checkGameEnd: (player: Player) => Promise<DrawGameEnd | null>;
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