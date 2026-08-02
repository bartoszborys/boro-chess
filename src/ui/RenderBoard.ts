import { FigureColor } from "@/domain/enums";
import { Coordinates } from "@/domain/value-objects/Coordinates";
import { BoardState } from "@/domain/entities/CheesBoard";

const reset = "\x1b[0m";
const dim = "\x1b[2m";
const bold = "\x1b[1m";
const whiteFg = "\x1b[97m";
const blackFg = "\x1b[30m";
const lightSquareBg = "\x1b[48;5;180m";
const darkSquareBg = "\x1b[48;5;94m";
const emptyFg = "\x1b[90m";
const labelFg = "\x1b[37m";

const cellWidth = 4;
const rowLabelWidth = 3;

export class RenderBoard {
    public constructor(
        private readonly board: BoardState,
    ) { }

    public render(): void {
        console.clear();
        const state = this.board.getState();
        const allCoordinates = new Array(8).fill(0).map((_, indexY) => new Array(8).fill(0).map((_, indexX) => new Coordinates(indexX + 1, indexY + 1)));

        console.log(this.renderColumnLabels());

        for (const [rowIndex, coordinatesRow] of allCoordinates.entries()) {
            const toRender = [this.renderRowLabel(rowIndex + 1)];
            for (const [colIndex, coordinate] of coordinatesRow.entries()) {
                const squareBg = (rowIndex + colIndex) % 2 === 0 ? lightSquareBg : darkSquareBg;
                const figure = state.find(item => item.coordinates.equals(coordinate));

                if (figure) {
                    const label = `${figure.color === FigureColor.WHITE ? "W" : "B"}${figure.name.charAt(0).toUpperCase()}`;
                    const fg = figure.color === FigureColor.WHITE ? whiteFg : blackFg;
                    toRender.push(`${squareBg}${bold}${fg} ${label} ${reset}`);
                } else {
                    toRender.push(`${squareBg}${dim}${emptyFg}${" ".repeat(cellWidth)}${reset}`);
                }
            }
            console.log(toRender.join(""));
        }
    }

    private renderColumnLabels(): string {
        const labels = [" ".repeat(rowLabelWidth)];
        for (let x = 1; x <= 8; x++) {
            labels.push(`${dim}${labelFg} ${x}  ${reset}`);
        }
        return labels.join("");
    }

    private renderRowLabel(y: number): string {
        return `${dim}${labelFg}${String(y).padStart(2, " ")} ${reset}`;
    }
}
