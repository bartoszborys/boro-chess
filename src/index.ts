import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { SelectFigureToMoveUseCase } from "./application/use-cases/SelectFigureToMove.use-case";
import {
  boardFactory,
  consolePromotionChoice,
  game,
  gameRules,
  moveAnalyzer,
  newGameUseCase,
  playerFigureMoveUseCase,
  promotionUseCase,
  renderBoard,
} from "./chess-bootstrap";
import { Coordinates } from "./domain/value-objects/Coordinates";
import { Movement } from "./domain/value-objects/Movement";
import { Player } from "./domain/entities/Player";
import { ConsolePromotionChoice } from "./ui/ConsolePromotionChoice";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function coordinatesFromKey(key: string): Coordinates {
  const [xRaw, yRaw] = key.trim().split("-");
  const x = Number(xRaw);
  const y = Number(yRaw);

  if (!Number.isInteger(x) || !Number.isInteger(y)) {
    throw new Error(`Invalid coordinates key: "${key}". Expected format: x-y (e.g. 8-1)`);
  }

  return new Coordinates(x, y);
}

function getMateExampleMoves(): Movement[] {
  return [
    new Movement(new Coordinates(5, 2), new Coordinates(5, 3)),
    new Movement(new Coordinates(6, 1), new Coordinates(3, 4)),
    new Movement(new Coordinates(4, 1), new Coordinates(8, 5)),
    new Movement(new Coordinates(8, 5), new Coordinates(6, 7)),
  ];
}

function getPatExampleMoves(): Movement[] {
  return [
    new Movement(new Coordinates(5, 2), new Coordinates(5, 3)),
    new Movement(new Coordinates(1, 7), new Coordinates(1, 5)),
    new Movement(new Coordinates(4, 1), new Coordinates(8, 5)),
    new Movement(new Coordinates(1, 8), new Coordinates(1, 6)),
    new Movement(new Coordinates(8, 5), new Coordinates(1, 5)),
    new Movement(new Coordinates(8, 7), new Coordinates(8, 5)),
    new Movement(new Coordinates(1, 5), new Coordinates(3, 7)),
    new Movement(new Coordinates(1, 6), new Coordinates(8, 6)),
    new Movement(new Coordinates(8, 2), new Coordinates(8, 4)),
    new Movement(new Coordinates(6, 7), new Coordinates(6, 6)),
    new Movement(new Coordinates(3, 7), new Coordinates(4, 7)),
    new Movement(new Coordinates(5, 8), new Coordinates(6, 7)),
    new Movement(new Coordinates(4, 7), new Coordinates(2, 7)),
    new Movement(new Coordinates(4, 8), new Coordinates(4, 3)),
    new Movement(new Coordinates(2, 7), new Coordinates(2, 8)),
    new Movement(new Coordinates(4, 3), new Coordinates(8, 7)),
    new Movement(new Coordinates(2, 8), new Coordinates(3, 8)),
    new Movement(new Coordinates(6, 7), new Coordinates(7, 6)),
    new Movement(new Coordinates(3, 8), new Coordinates(5, 6)),
  ];
}

function getExampleMovesOld(): Movement[] {
  const horseMoveTo = new Movement(new Coordinates(7, 1), new Coordinates(6, 3));
  const horseMoveFrom = new Movement(new Coordinates(6, 3), new Coordinates(7, 1));
  const exampleMoves = [
    new Movement(new Coordinates(8, 2), new Coordinates(8, 4)),
    new Movement(new Coordinates(1, 2), new Coordinates(1, 3)),
    new Movement(new Coordinates(2, 2), new Coordinates(2, 3)),
    new Movement(new Coordinates(3, 2), new Coordinates(3, 3)),
    new Movement(new Coordinates(4, 2), new Coordinates(4, 3)),
    new Movement(new Coordinates(5, 2), new Coordinates(5, 3)),
    new Movement(new Coordinates(7, 2), new Coordinates(7, 3)),
    new Movement(new Coordinates(6, 1), new Coordinates(7, 2)),

    horseMoveTo,
    horseMoveFrom,
    horseMoveTo,
    new Movement(new Coordinates(8, 1), new Coordinates(8, 2)),
    new Movement(new Coordinates(8, 2), new Coordinates(8, 1)),

    new Movement(new Coordinates(5, 7), new Coordinates(5, 6)),
    new Movement(new Coordinates(4, 8), new Coordinates(8, 4)),
    new Movement(new Coordinates(8, 1), new Coordinates(8, 4)),
    new Movement(new Coordinates(8, 4), new Coordinates(8, 1)),

    new Movement(new Coordinates(5, 8), new Coordinates(5, 7)),
    new Movement(new Coordinates(5, 7), new Coordinates(6, 6)),
    // new Movement(new Coordinates(7, 7), new Coordinates(7, 6)),
    new Movement(new Coordinates(8, 1), new Coordinates(8, 6)),
  ];

  return exampleMoves;
}

function getPromotionExampleMoves(): Movement[] {
  return [
    new Movement(new Coordinates(5, 2), new Coordinates(5, 4)),
    new Movement(new Coordinates(4, 1), new Coordinates(8, 5)),
    new Movement(new Coordinates(8, 5), new Coordinates(8, 7)),
    new Movement(new Coordinates(8, 7), new Coordinates(8, 8)),
    new Movement(new Coordinates(8, 8), new Coordinates(7, 8)),
    new Movement(new Coordinates(8, 2), new Coordinates(8, 4)),
    new Movement(new Coordinates(8, 4), new Coordinates(8, 5)),
    new Movement(new Coordinates(8, 5), new Coordinates(8, 6)),
    new Movement(new Coordinates(8, 6), new Coordinates(8, 7)),
    new Movement(new Coordinates(8, 7), new Coordinates(8, 8)),
  ];
}

async function main() {
  newGameUseCase.execute();
  renderBoard.render();
  for (const move of getPromotionExampleMoves()) {
    const figure = boardFactory.getBoard().getFigureByCoordinatesOrThrow(move.from);
    const currentPlayer = new Player(figure.getColor());
    const gameState = playerFigureMoveUseCase.execute(move, currentPlayer);

    if (gameState?.promotion) {
      const result = await consolePromotionChoice.pick();
      promotionUseCase.execute(boardFactory.getBoard(), currentPlayer, result);
    }
    renderBoard.render();
    await sleep(20);
  }

  const rl = createInterface({ input, output });
  const selectFigureToMove = new SelectFigureToMoveUseCase(boardFactory, moveAnalyzer, game, gameRules);

  try {
    for (let i = 0; i < 10; i++) {
      const key = await rl.question(`Select figure [${i + 1}/10] (x-y): `);
      const coordinates = coordinatesFromKey(key);
      const figure = boardFactory.getBoard().getFigureByCoordinatesOrThrow(coordinates);
      const availableMoves = selectFigureToMove.execute(coordinates, figure.getColor());
      renderBoard.render(availableMoves);
    }
  } finally {
    rl.close();
  }
}

main();
