import { Coordinates } from "@/domain/value-objects/Coordinates";

export class Movement {
  constructor(
    readonly from: Coordinates,
    readonly to: Coordinates,
  ) { }
}
