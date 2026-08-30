import {
    boardFactory,
    consolePromotionChoice,
    newGameUseCase,
    playerFigureMoveUseCase,
    promotionUseCase,
    checkGameEndUseCase,
    renderBoard,
    consoleMovementChoice,
    selectFigureToMoveUseCase,
} from "@/chess-bootstrap";
import { Movement } from "@/domain/value-objects/Movement";
import { Player } from "@/domain/entities/Player";
import { Coordinates } from "@/domain/value-objects/Coordinates";

async function consoleMain() {
    newGameUseCase.execute();
    renderBoard.render();

    while (true) {
        const from = await consoleMovementChoice.pickFrom();
        const figure = boardFactory.getBoard().getFigureByCoordinates(from);

        if (figure === null) {
            console.log("No figure found at the selected coordinates");
            continue;
        }

        const availableMoves = selectFigureToMoveUseCase.execute(from, figure.getColor());
        renderBoard.render(availableMoves);

        const to = await consoleMovementChoice.pickTo(availableMoves);

        if (to === null) {
            continue;
        }

        const move = new Movement(from, Coordinates.fromKey(to));
        const currentPlayer = new Player(figure.getColor());

        let moveResult;
        try {
            moveResult = playerFigureMoveUseCase.execute(move, currentPlayer);
        } catch (error) {
            console.log(error);
            continue;
        }

        if (moveResult.promotion) {
            const result = await consolePromotionChoice.pick();
            promotionUseCase.execute(boardFactory.getBoard(), currentPlayer, result);
        }

        renderBoard.render();
        const gameEndState = checkGameEndUseCase.execute(currentPlayer);

        if (gameEndState) {
            console.log(`Game ended: ${gameEndState.winner?.color} won`);
            break;
        }
    }
}

consoleMain();
