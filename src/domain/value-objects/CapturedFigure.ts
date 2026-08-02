import { FigureColor, FigureName } from "@/domain/enums";

export type CapturedFigure = Readonly<{
    name: FigureName;
    color: FigureColor;
}>;
