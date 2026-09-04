import { Movement } from "@/core/domain/value-objects/Movement";
import { Coordinates } from "@/core/domain/value-objects/Coordinates";

export function getMateExampleMoves(): Movement[] {
  return [
    new Movement(new Coordinates(5, 2), new Coordinates(5, 3)),
    new Movement(new Coordinates(6, 1), new Coordinates(3, 4)),
    new Movement(new Coordinates(4, 1), new Coordinates(8, 5)),
    new Movement(new Coordinates(8, 5), new Coordinates(6, 7)),
  ];
}

export function getPatExampleMoves(): Movement[] {
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

export function getExampleMovesOld(): Movement[] {
  const knightMoveTo = new Movement(new Coordinates(7, 1), new Coordinates(6, 3));
  const knightMoveFrom = new Movement(new Coordinates(6, 3), new Coordinates(7, 1));
  const exampleMoves = [
    new Movement(new Coordinates(8, 2), new Coordinates(8, 4)),
    new Movement(new Coordinates(1, 2), new Coordinates(1, 3)),
    new Movement(new Coordinates(2, 2), new Coordinates(2, 3)),
    new Movement(new Coordinates(3, 2), new Coordinates(3, 3)),
    new Movement(new Coordinates(4, 2), new Coordinates(4, 3)),
    new Movement(new Coordinates(5, 2), new Coordinates(5, 3)),
    new Movement(new Coordinates(7, 2), new Coordinates(7, 3)),
    new Movement(new Coordinates(6, 1), new Coordinates(7, 2)),

    knightMoveTo,
    knightMoveFrom,
    knightMoveTo,
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

export function getPromotionExampleMoves(): Movement[] {
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
