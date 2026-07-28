type DirectionConstructorOptions = {
    deltaX: number;
    deltaY: number;
} & DirectionOptions;

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
}
