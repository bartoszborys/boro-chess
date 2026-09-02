import { FigureColor, FigureName } from "@/domain/enums";
import type { CSSProperties } from "react";
import wK from "~/assets/pieces/wK.svg";
import wQ from "~/assets/pieces/wQ.svg";
import wR from "~/assets/pieces/wR.svg";
import wB from "~/assets/pieces/wB.svg";
import wN from "~/assets/pieces/wN.svg";
import wP from "~/assets/pieces/wP.svg";
import bK from "~/assets/pieces/bK.svg";
import bQ from "~/assets/pieces/bQ.svg";
import bR from "~/assets/pieces/bR.svg";
import bB from "~/assets/pieces/bB.svg";
import bN from "~/assets/pieces/bN.svg";
import bP from "~/assets/pieces/bP.svg";

const pieceSrc: Record<FigureColor, Record<FigureName, string>> = {
  [FigureColor.WHITE]: {
    [FigureName.KING]: wK,
    [FigureName.QUEEN]: wQ,
    [FigureName.ROOK]: wR,
    [FigureName.BISHOP]: wB,
    [FigureName.KNIGHT]: wN,
    [FigureName.PAWN]: wP,
  },
  [FigureColor.BLACK]: {
    [FigureName.KING]: bK,
    [FigureName.QUEEN]: bQ,
    [FigureName.ROOK]: bR,
    [FigureName.BISHOP]: bB,
    [FigureName.KNIGHT]: bN,
    [FigureName.PAWN]: bP,
  },
};

export type BoardVector = {
  x: number;
  y: number;
};

type ChessPieceProps = {
  color: FigureColor;
  name: FigureName;
  fromCurrent?: BoardVector | null;
  onMoveEnd?: () => void;
};

export const ChessPiece = ({ color, name, fromCurrent, onMoveEnd }: ChessPieceProps) => {
  const moving = Boolean(fromCurrent);

  return (
    <img
      src={pieceSrc[color][name]}
      alt={`${color} ${name}`}
      draggable={false}
      className={`w-[92%] h-[92%] pointer-events-none select-none ${moving ? "piece-from-vector" : ""}`}
      style={
        moving
          ? ({
              "--move-x": fromCurrent?.x ?? 0,
              "--move-y": fromCurrent?.y ?? 0,
            } as CSSProperties)
          : undefined
      }
      onAnimationEnd={(event) => {
        if (event.animationName === "piece-from-vector") {
          onMoveEnd?.();
        }
      }}
    />
  );
};
