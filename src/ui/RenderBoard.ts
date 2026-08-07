import { FigureColor } from "@/domain/enums";
import {
  Coordinates,
  CoordinatesKey,
} from "@/domain/value-objects/Coordinates";
import { BoardFactory } from "@/application/factories/BoardFactory";

const reset = "\x1b[0m";
const dim = "\x1b[2m";
const bold = "\x1b[1m";
const whiteFg = "\x1b[97m";
const blackFg = "\x1b[30m";
const lightSquareBg = "\x1b[48;5;180m";
const darkSquareBg = "\x1b[48;5;94m";
const lightPossibleMoveBg = "\x1b[48;5;183m";
const darkPossibleMoveBg = "\x1b[48;5;97m";
const emptyFg = "\x1b[90m";
const labelFg = "\x1b[37m";
const possibleMoveMarkerFg = "\x1b[38;5;231m";

const cellWidth = 4;
const rowLabelWidth = 3;

export class RenderBoard {
  public constructor(private readonly board: BoardFactory) {}

  public render(possibleMoves: CoordinatesKey[] = []): void {
    console.clear();
    const boardtate = this.board.getBoardState();
    const state = boardtate.getFiguresState();
    const [xSize, ySize] = this.board.getBoardSize();
    const possibleMoveKeys = new Set(possibleMoves);
    const allCoordinates = new Array(ySize)
      .fill(0)
      .map((_, indexY) =>
        new Array(xSize)
          .fill(0)
          .map((_, indexX) => new Coordinates(indexX + 1, indexY + 1)),
      );

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
        const figure = state.find((item) =>
          item.coordinates.equals(coordinate),
        );

        if (figure) {
          const label = `${figure.color === FigureColor.WHITE ? "W" : "B"}${figure.name.charAt(0).toUpperCase()}`;
          const fg = figure.color === FigureColor.WHITE ? whiteFg : blackFg;
          toRender.push(`${squareBg}${bold}${fg} ${label} ${reset}`);
        } else if (isPossibleMove) {
          toRender.push(`${squareBg}${dim}${possibleMoveMarkerFg}    ${reset}`);
        } else {
          toRender.push(
            `${squareBg}${dim}${emptyFg}${" ".repeat(cellWidth)}${reset}`,
          );
        }
      }
      console.log(toRender.join(""));
    }
  }

  private renderColumnLabels(): string {
    const labels = [" ".repeat(rowLabelWidth)];
    const [xSize, _] = this.board.getBoardSize();
    for (let x = 1; x <= xSize; x++) {
      labels.push(`${dim}${labelFg} ${x}  ${reset}`);
    }
    return labels.join("");
  }

  private renderRowLabel(y: number): string {
    return `${dim}${labelFg}${String(y).padStart(2, " ")} ${reset}`;
  }
}
