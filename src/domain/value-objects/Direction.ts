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

        let xStepPassed = movement.sameX();
        let yStepPassed = movement.sameY();


        const movementDelta = movement.calculateDelta();

        if (!xStepPassed && this.deltaX !== 0) {
            xStepPassed = movementDelta.x % Math.abs(this.deltaX) === 0;
        }

        if (!yStepPassed && this.deltaY !== 0) {
            yStepPassed = movementDelta.y % Math.abs(this.deltaY) === 0;
        }

        return xStepPassed && yStepPassed;
    }
}