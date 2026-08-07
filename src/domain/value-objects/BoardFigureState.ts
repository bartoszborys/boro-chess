import { Coordinates } from "./Coordinates";
import { FigureColor, FigureName } from "../enums";

export type BoardFigureState = {
    coordinates: Coordinates;
    name: FigureName;
    color: FigureColor;
    isCaptured: boolean;
};
