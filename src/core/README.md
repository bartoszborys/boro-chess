# Core — board games

`src/core` is a **generic board-game kernel**: board, figures, moves, turns, game rules. It is not the chess module.

Chess lives in `src/chess`. Do **not** add chess-only concepts, piece names, special moves, or rules here.

## What belongs here

Abstractions shared by many games (chess, checkers, other grid games with pieces):

- board, field, figure, player
- coordinates, movement vector, move history
- application ports (repositories, use-cases) built on those abstractions

## What does not belong here

Anything chess-specific: piece names, castling, check/mate as such, pawn promotion to queen, etc. That goes to `src/chess`.

## To move (already in core)

Chess leftovers that already exist here — extract them into `src/chess`, do not grow them in core:

- [ ] `FigureName` (`pawn`, `knight`, `bishop`, `rook`, `queen`, `king`) — chess piece names
- [ ] `KingNotFound` — king is a chess piece
- [ ] `Direction.castling` / `ChessDirectionOptions` — castling
- [ ] `ValidatedMoveContext.castlingMovement` — rook move during castling
- [ ] `PromotionRule` / `PendingPromotion` tied to `FigureName` — chess pawn promotion (generic promotion may stay, not in this shape)
