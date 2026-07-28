import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Board } from "../../domain/entities/CheesBoard";

export class PlayerFigureMoveUseCase {
    constructor(
        private readonly board: Board,
    ) { }

    public execute(from: Coordinates, to: Coordinates): void {
        const figure = this.board.getFigureByCoordinates(from);

        if (!figure) {
            throw new Error("Figure not found");
        }

        const hasMoved = figure.moveTo(to);

        if (!hasMoved) {
            throw new Error("Figure cannot move");
        }
    }
}