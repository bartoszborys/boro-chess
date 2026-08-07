import { CoordinatesKey } from "./Coordinates";

export type BoardFieldState = {
  coordinatesKey: CoordinatesKey;
  occupied: boolean;
  canCapture: boolean;
};
