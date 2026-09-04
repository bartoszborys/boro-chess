import { FigureName } from "@/core/domain/enums";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const promotionFigures = [FigureName.QUEEN, FigureName.ROOK, FigureName.KNIGHT, FigureName.BISHOP];

export class ConsolePromotionChoice {
  public async pick(): Promise<FigureName> {
    const rl = createInterface({ input, output });
    const options = promotionFigures.map((name, index) => `${index + 1}. ${name}`).join("\n");

    try {
      while (true) {
        const answer = (await rl.question(`Pick a promotion figure:\n${options}\n`)).trim().toLowerCase();
        const byNumber = promotionFigures[Number(answer) - 1];
        if (byNumber) {
          return byNumber;
        }

        const byName = promotionFigures.find((name) => name === answer);
        if (byName) {
          return byName;
        }
      }
    } finally {
      rl.close();
    }
  }
}
