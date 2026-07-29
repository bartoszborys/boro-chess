import { Direction } from "@/domain/value-objects/Direction";

export interface MovementValidator {
  getDirections(): Direction[];
}
