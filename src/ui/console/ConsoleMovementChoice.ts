import { createInterface, type Interface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { Coordinates, CoordinatesKey } from "@/domain/value-objects/Coordinates";

export class ConsoleMovementChoice {
    public async pickFrom(): Promise<Coordinates> {
        const rl = createInterface({ input, output });

        try {
            return await this.askCoordinates(rl, "From (xy): ");
        } finally {
            rl.close();
        }
    }

    public async pickTo(availableMoves: CoordinatesKey[]): Promise<CoordinatesKey | null> {
        const rl = createInterface({ input, output });
        const options = availableMoves.map((name, index) => `${index + 1}. ${name}`).join("\n");


        try {
            const answer = (await rl.question(`Pick a promotion figure:\n${options}\n`)).trim().toLowerCase();
            const byNumber = availableMoves[Number(answer) - 1];
            if (byNumber) {
                return byNumber;
            }
            return null;
        } finally {
            rl.close();
        }
    }

    private async askCoordinates(rl: Interface, prompt: string): Promise<Coordinates> {
        while (true) {
            const answer = (await rl.question(prompt)).trim();
            const coordinates = this.coordinatesFromKey(answer);
            if (coordinates) {
                return coordinates;
            }
        }
    }

    private coordinatesFromKey(key: string): Coordinates | null {
        const [xRaw, yRaw] = key.split("");
        const x = Number(xRaw);
        const y = Number(yRaw);

        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            return null;
        }

        return new Coordinates(x, y);
    }
}
