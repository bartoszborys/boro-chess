import { Coordinates } from "./Coordinates";
import { Figure } from "@/domain/entities/CheesFigure";

export interface BoardField {
    coordinates: Coordinates;
    figure: Figure | null;
}