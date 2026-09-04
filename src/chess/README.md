# Chess

`src/chess` is the **chess** module: piece behaviors, chess rules, and wiring on top of `src/core`.

## Implemented

- Standard 8×8 setup (`NewChessGameUseCase`)
- Piece moves: king, queen, rook, bishop, knight, pawn (single step, double from start, diagonal capture)
- Capture, blocked paths, no capturing own pieces
- Turns (`ChessGame`) and player clocks
- Legal-move filtering that rejects moves leaving the king in check
- Check detection (`ChessKingCheck` + `ByBehaviorCheckRule`)
- Checkmate vs stalemate when the opponent has no legal move (check → win, otherwise draw)
- Castling: king and rook unmoved, empty path between them (not full FIDE — see To do)
- Pawn promotion on the last rank (queen, rook, bishop, knight)
- Move history / undo (move, capture, castling, promotion)

## To do

1. Revert move
2. Players turns
3. Castling (FIDE): cannot castle out of / through / into check; queenside path includes b-file
4. En passant
5. Draw: 50-move rule
6. Draw: threefold repetition
7. Draw: insufficient material
8. Console: stalemate message when winner is null
9. Web UI (engine already exists; web is still the RR template)
