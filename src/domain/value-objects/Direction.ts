import { Movement } from "./Movement";

type DirectionConstructorOptions = DirectionMoveVector & DirectionOptions;

type DirectionMoveVector = {
    deltaX: number;
    deltaY: number;
}

export type DirectionOptions = {
    whenEnemy?: boolean;
    canCapture?: boolean;
    maxRange?: number;
    whenStartingPosition?: boolean;
}

export class Direction {
    public readonly deltaX: number;
    public readonly deltaY: number;
    public readonly whenEnemy: boolean;
    public readonly canCapture: boolean;
    public readonly maxRange: number;
    public readonly whenStartingPosition: boolean;

    public constructor({
        deltaX,
        deltaY,
        whenEnemy,
        canCapture,
        maxRange,
        whenStartingPosition
    }: DirectionConstructorOptions) {
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.whenEnemy = whenEnemy ?? false;
        this.canCapture = canCapture ?? true;
        this.maxRange = maxRange ?? Infinity;
        this.whenStartingPosition = whenStartingPosition ?? false;
    }

    public matchesMovement(movement: Movement): boolean {
        if (movement.capturing && !this.canCapture) {
            return false;
        }

        const delta = movement.calculateDelta();

        if (this.deltaX !== 0) {
            const k = delta.x / this.deltaX;

            if (!Number.isInteger(k) || k <= 0) {
                return false;
            }

            return delta.y === k * this.deltaY;
        }

        if (this.deltaY !== 0) {
            const k = delta.y / this.deltaY;

            if (!Number.isInteger(k) || k <= 0) {
                return false;
            }

            return delta.x === k * this.deltaX;
        }

        return false;
    }
}