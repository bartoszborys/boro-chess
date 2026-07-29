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
        const delta = movement.calculateDelta();
        const stepX = delta.x / Math.abs(delta.x) || 0;
        const stepY = delta.y / Math.abs(delta.y) || 0;

        if (movement.capturing && !this.canCapture) {
            return false;
        }

        return this.deltaX === stepX && this.deltaY === stepY;
    }
}