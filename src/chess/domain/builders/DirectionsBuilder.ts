import { Direction, type DirectionOptions } from "@/core/domain/value-objects/Direction";

export class DirectionsBuilder {
  public readonly directions: Direction[] = [];

  private constructor() {}

  public static create(): DirectionsBuilder {
    return new DirectionsBuilder();
  }

  public build(): Direction[] {
    return this.directions;
  }

  private addDirection(direction: Direction): void {
    this.directions.push(direction);
  }

  public addCustomDirection(deltaX: number, deltaY: number, options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX, deltaY, ...options }));
    return this;
  }

  public addTopLeftDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: -1, deltaY: 1, ...options }));
    return this;
  }

  public addTopRightDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: 1, deltaY: 1, ...options }));
    return this;
  }

  public addBottomLeftDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: -1, deltaY: -1, ...options }));
    return this;
  }

  public addBottomRightDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: 1, deltaY: -1, ...options }));
    return this;
  }

  public addTopDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: 0, deltaY: 1, ...options }));
    return this;
  }

  public addBottomDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: 0, deltaY: -1, ...options }));
    return this;
  }

  public addLeftDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: -1, deltaY: 0, ...options }));
    return this;
  }

  public addRightDirection(options: DirectionOptions = {}): this {
    this.addDirection(new Direction({ deltaX: 1, deltaY: 0, ...options }));
    return this;
  }
}
