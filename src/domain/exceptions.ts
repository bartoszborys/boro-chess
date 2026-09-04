export class GameException extends Error { }

export class FigureInvalidMove extends GameException { }

export class FigureNotFound extends GameException { }

export class BoardFieldNotFound extends GameException { }

export class FigureMoveCollision extends GameException { }

export class MoveHistoryNotFound extends GameException { }

export class PlayerCannotMoveException extends GameException { }

export class FigureColorMismatchException extends GameException { }

export class InvalidFigureNameException extends GameException { }

export class PlayerNotFound extends GameException { }

export class KingNotFound extends GameException { }
