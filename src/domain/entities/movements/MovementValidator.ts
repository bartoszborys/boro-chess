export type Coordinates = {
  x: number;
  y: number;
};

export interface MovementValidator {
  canMove(from: Coordinates, to: Coordinates): boolean;
}
