import { Movement } from "./Movement";

export type ValidatedMoveContext = {
  movement: Movement;
  capturing: boolean;
  castlingMovement?: Movement;
};
