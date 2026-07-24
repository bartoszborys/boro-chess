# Figures:
    pawn
    horse
    tower
    king
    queen
    bishop

# Figures Movements
1. Pawn might move two forward when untouched
2. Pawn might move one forward, white from 1 to 8, black should go from 8 to 1
3. horse should move two in one axis and one in another
4. tower should move in one axis
5. bishop vector should change by same value in both axis
6. queen should be aggregation of tower and bishop
7. king should move only by one in every direction

# Constraints & Rules
1. King can be checked by another Figure expect King
2. King cannot stand around another King
3. "Moving figure" cannot go throught another Figure expect Horse.
4. When figure move to coordinate where is another figure then this figure is taken (Expect the King figure)
5. Pawns can only go forward

Do zredagowania poniższe
6. Every figure expect pawn has "take ability" equal to "movement"
7. Pawn can take another figure only from V1(+1,+1) or V2(+1, -1)

# Definitions
1. Check is when figure in next move would take a king
2. "Take Ability" is when figure can destroy another figure
3. "Moving Figure" is currently moved figure by current player