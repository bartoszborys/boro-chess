import { FigureColor, FigureName } from "@/domain/enums";
import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";
import { BoardFactory } from "@/application/factories/BoardFactory";
import type { BoardSettings } from "@/domain/services/BoardSettings";

const reset = "\x1b[0m";
const dim = "\x1b[2m";
const lightSquareBg = "\x1b[48;5;180m";
const darkSquareBg = "\x1b[48;5;94m";
const lightPossibleMoveBg = "\x1b[48;5;183m";
const darkPossibleMoveBg = "\x1b[48;5;97m";
const emptyFg = "\x1b[90m";
const labelFg = "\x1b[37m";
const possibleMoveMarkerFg = "\x1b[38;5;231m";

const cellWidth = 4;
const rowLabelWidth = 3;

const figureIcons: Record<FigureColor, Record<FigureName, string>> = {
  [FigureColor.WHITE]: {
    [FigureName.KING]: "♔",
    [FigureName.QUEEN]: "♕",
    [FigureName.ROOK]: "♖",
    [FigureName.BISHOP]: "♗",
    [FigureName.KNIGHT]: "♘",
    [FigureName.PAWN]: "♙",
  },
  [FigureColor.BLACK]: {
    [FigureName.KING]: "♚",
    [FigureName.QUEEN]: "♛",
    [FigureName.ROOK]: "♜",
    [FigureName.BISHOP]: "♝",
    [FigureName.KNIGHT]: "♞",
    [FigureName.PAWN]: "♟",
  },
};

export class RenderBoard {
  public constructor(
    private readonly board: BoardFactory,
    private readonly boardSettings: BoardSettings,
  ) {}

  public render(possibleMoves: CoordinatesKey[] = []): void {
    console.clear();
    const boardtate = this.board.getBoardState();
    const state = boardtate.getFiguresState();
    const [xSize, ySize] = this.boardSettings.getBoardSize();
    const possibleMoveKeys = new Set(possibleMoves);
    const allCoordinates = new Array(ySize)
      .fill(0)
      .map((_, indexY) => new Array(xSize).fill(0).map((_, indexX) => new Coordinates(indexX + 1, indexY + 1)));

    console.log(this.renderColumnLabels());

    for (const [rowIndex, coordinatesRow] of allCoordinates.entries()) {
      const toRender = [this.renderRowLabel(rowIndex + 1)];
      for (const [colIndex, coordinate] of coordinatesRow.entries()) {
        const isPossibleMove = possibleMoveKeys.has(coordinate.toKey());
        const isLightSquare = (rowIndex + colIndex) % 2 === 0;
        const squareBg = isPossibleMove
          ? isLightSquare
            ? lightPossibleMoveBg
            : darkPossibleMoveBg
          : isLightSquare
            ? lightSquareBg
            : darkSquareBg;
        const figure = state.find((item) => item.coordinates.equals(coordinate));

        if (figure) {
          const icon = figureIcons[figure.color][figure.name];
          toRender.push(`${squareBg} ${icon}  ${reset}`);
        } else if (isPossibleMove) {
          toRender.push(`${squareBg}${dim}${possibleMoveMarkerFg}    ${reset}`);
        } else {
          toRender.push(`${squareBg}${dim}${emptyFg}${" ".repeat(cellWidth)}${reset}`);
        }
      }
      console.log(toRender.join(""));
    }
  }

  private renderColumnLabels(): string {
    const labels = [" ".repeat(rowLabelWidth)];
    const [xSize] = this.boardSettings.getBoardSize();
    for (let x = 1; x <= xSize; x++) {
      labels.push(`${dim}${labelFg} ${x}  ${reset}`);
    }
    return labels.join("");
  }

  private renderRowLabel(y: number): string {
    return `${dim}${labelFg}${String(y).padStart(2, " ")} ${reset}`;
  }
}
