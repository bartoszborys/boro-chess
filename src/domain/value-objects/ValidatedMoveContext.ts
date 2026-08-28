import { Movement } from "@/domain/value-objects/Movement";

export type ValidatedMoveContext = {
  movement: Movement;
  capturing: boolean;
  castlingMovement?: Movement;
};
