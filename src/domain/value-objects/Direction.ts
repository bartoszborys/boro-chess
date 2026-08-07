import { Movement } from "@/domain/value-objects/Movement";

type DirectionConstructorOptions = DirectionMoveVector & DirectionOptions;

//@TODO Add method asVector
export type DirectionMoveVector = {
  deltaX: number;
  deltaY: number;
  maxRange?: number;
  minRange?: number;
};

export type DirectionOptions = {
  whenEnemy?: boolean;
  canCapture?: boolean;
  whenStartingPosition?: boolean;
  castling?: boolean;
};

export type DirectionMatchingConditions = {
  capturing?: boolean;
  hasMoved?: boolean;
};

export class Direction {
  public readonly deltaX: number;
  public readonly deltaY: number;
  public readonly whenEnemy: boolean;
  public readonly canCapture: boolean;
  public readonly maxRange: number;
  public readonly minRange: number;
  public readonly whenStartingPosition: boolean;
  public readonly castling: boolean;

  public constructor({
    deltaX,
    deltaY,
    whenEnemy,
    canCapture,
    maxRange,
    minRange,
    whenStartingPosition,
    castling,
  }: DirectionConstructorOptions) {
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.whenEnemy = whenEnemy ?? false;
    this.canCapture = canCapture ?? true;
    this.maxRange = maxRange ?? Infinity;
    this.minRange = minRange ?? 1;
    this.whenStartingPosition = whenStartingPosition ?? false;
    this.castling = castling ?? false;
  }

  public matches(
    movement: Movement,
    conditions: DirectionMatchingConditions,
  ): boolean {
    return this.matchesMovement(movement) && this.matchesConditions(conditions);
  }

  private matchesMovement(movement: Movement): boolean {
    const moveX = movement.to.x - movement.from.x;
    const moveY = movement.to.y - movement.from.y;

    if (this.deltaX !== 0) {
      const k = moveX / this.deltaX;

      if (!Number.isInteger(k) || k <= 0) {
        return false;
      }

      if (k > this.maxRange || k < this.minRange) {
        return false;
      }

      return moveY === k * this.deltaY;
    }

    if (this.deltaY !== 0) {
      const k = moveY / this.deltaY;

      if (!Number.isInteger(k) || k <= 0) {
        return false;
      }

      if (k > this.maxRange || k < this.minRange) {
        return false;
      }

      return moveX === k * this.deltaX;
    }

    return false;
  }

  // @TODO To be moved to the MoveAnalyzer
  private matchesConditions(conditions: DirectionMatchingConditions): boolean {
    if (conditions.capturing && !this.canCapture) {
      return false;
    }

    if (this.whenStartingPosition && conditions.hasMoved) {
      return false;
    }

    return true;
  }
}
