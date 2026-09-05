import { emitKeypressEvents, type Key } from "node:readline";
import { stdin as input } from "node:process";
import { Coordinates, CoordinatesKey } from "@/core/domain/value-objects/Coordinates";
import type { BoardSettings } from "@/core/domain/services/BoardSettings";

export class ConsoleMovementChoice {
  private currentX = 1;
  private currentY = 1;

  constructor(
    private readonly boardSettings: BoardSettings,
    private readonly renderCursor: (cursor: Coordinates, availableMoves?: CoordinatesKey[]) => void,
  ) {}

  public async pickFrom(): Promise<Coordinates> {
    return await this.askCoordinates();
  }

  public async pickTo(availableMoves: CoordinatesKey[]): Promise<CoordinatesKey | null> {
    const coordinates = await this.askCoordinates(availableMoves);
    const key = coordinates.toKey();
    if (availableMoves.includes(key)) {
      return key;
    }
    return null;
  }

  private async askCoordinates(availableMoves: CoordinatesKey[] = []): Promise<Coordinates> {
    const [xSize, ySize] = this.boardSettings.getBoardSize();
    this.currentX = Math.min(xSize, Math.max(1, this.currentX));
    this.currentY = Math.min(ySize, Math.max(1, this.currentY));

    emitKeypressEvents(input);
    if (!input.isTTY) {
      throw new Error("Arrow navigation requires a TTY");
    }

    const wasRaw = input.isRaw;
    input.setRawMode(true);
    input.resume();
    this.renderCursor(new Coordinates(this.currentX, this.currentY), availableMoves);

    return new Promise((resolve) => {
      const onKeypress = (_value: string | undefined, key: Key) => {
        if (!key) {
          return;
        }

        if (key.ctrl && key.name === "c") {
          cleanup();
          process.exit(0);
        }

        if (key.name === "return") {
          cleanup();
          resolve(new Coordinates(this.currentX, this.currentY));
          return;
        }

        if (key.name === "left") {
          this.currentX = Math.max(1, this.currentX - 1);
        } else if (key.name === "right") {
          this.currentX = Math.min(xSize, this.currentX + 1);
        } else if (key.name === "up") {
          this.currentY = Math.max(1, this.currentY - 1);
        } else if (key.name === "down") {
          this.currentY = Math.min(ySize, this.currentY + 1);
        } else {
          return;
        }

        this.renderCursor(new Coordinates(this.currentX, this.currentY), availableMoves);
      };

      const cleanup = () => {
        input.off("keypress", onKeypress);
        input.setRawMode(wasRaw);
      };

      input.on("keypress", onKeypress);
    });
  }
}
