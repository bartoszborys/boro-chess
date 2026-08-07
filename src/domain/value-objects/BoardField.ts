import { Coordinates } from "./Coordinates";
import { Figure } from "@/domain/entities/CheesFigure";

export type BoardField = {
    coordinates: Coordinates;
    figure: Figure | null;
};
