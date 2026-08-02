import { newGameUseCase, playerFigureMoveUseCase, renderBoard } from "./bootstrap";
import { Coordinates } from "./domain/value-objects/Coordinates";
import { Movement } from "./domain/value-objects/Movement";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function getExampleMoves(): Movement[] {
    const horseMoveTo = new Movement(new Coordinates(7, 1), new Coordinates(6, 3));
    const horseMoveFrom = new Movement(new Coordinates(6, 3), new Coordinates(7, 1));
    const exampleMoves = [
        new Movement(new Coordinates(1, 2), new Coordinates(1, 3)),
        new Movement(new Coordinates(2, 2), new Coordinates(2, 3)),
        new Movement(new Coordinates(3, 2), new Coordinates(3, 3)),
        new Movement(new Coordinates(4, 2), new Coordinates(4, 3)),
        new Movement(new Coordinates(5, 2), new Coordinates(5, 3)),
        new Movement(new Coordinates(7, 2), new Coordinates(7, 3)),
        new Movement(new Coordinates(8, 2), new Coordinates(8, 3)),
        new Movement(new Coordinates(6, 1), new Coordinates(7, 2)),

        horseMoveTo,
        horseMoveFrom,
        horseMoveTo,
        new Movement(new Coordinates(8, 1), new Coordinates(8, 2)),
        new Movement(new Coordinates(8, 2), new Coordinates(8, 1)),
        new Movement(new Coordinates(5, 1), new Coordinates(7, 1)),
    ];

    return exampleMoves;
}

async function main() {
    newGameUseCase.execute();
    renderBoard.render();

    for (const move of getExampleMoves()) {
        try {
            playerFigureMoveUseCase.execute(move);
        } catch (error) {
            throw error;
        }

        await sleep(100);

        renderBoard.render();
    }
}

main();