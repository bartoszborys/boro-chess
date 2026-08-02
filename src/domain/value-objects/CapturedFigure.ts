import { FigureColor, FigureName } from "@/domain/enums";

export type FigureDetails = Readonly<{
    name: FigureName;
    color: FigureColor;
}>;
