import { Coordinates } from "@/domain/value-objects/Coordinates";
import type { Board } from "../../domain/entities/CheesBoard";
import { FigureMoveCollision, FigureNotFound } from "@/domain/exceptions";

export class PlayerFigureMoveUseCase {
    constructor(
        private readonly board: Board,
    ) { }

    public execute(from: Coordinates, to: Coordinates): void {
        const figure = this.board.getFigureByCoordinates(from);

        if (!figure) {
            throw new FigureNotFound();
        }

        if (this.board.hasFigureMoveCollision(figure, to)) {
            throw new FigureMoveCollision();
        }

        figure.moveTo(to);
    }
}
