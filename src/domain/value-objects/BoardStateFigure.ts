import { Coordinates } from "./Coordinates";
import { FigureColor, FigureName } from "../enums";

export interface BoardStateFigure {
    coordinates: Coordinates;
    name: FigureName;
    color: FigureColor;
    isCaptured: boolean;
}