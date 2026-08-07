import { Board, BoardState } from "@/domain/entities/CheesBoard";
import { CoordinatesKey } from "@/domain/value-objects/Coordinates";

export interface BoardFactory {
    getBoard(): Board;
    getBoardState(): BoardState;
    getBoardSize(): [number, number];
}
