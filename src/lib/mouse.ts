import { Box, IBoxable } from "./box";
import { MOUSE_RADIUS } from "./constants";

export class Mouse implements IBoxable {
  private x: number;
  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getBox(): Box {
    return {x: this.x, y: this.y, size: MOUSE_RADIUS};
  }
}

