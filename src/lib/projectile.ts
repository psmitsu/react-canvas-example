import { Box, IBoxable } from "./box";
import { HERO_RADIUS, PROJECTILE_RADIUS } from "./constants";

export class Projectile implements IBoxable {
  private x: number;
  private y: number;
  private absDeltaX: number;
  private direction: 1 | -1;
  private color: string | CanvasGradient | CanvasPattern; 

  constructor(
    x: number,
    y: number,
    absDeltaX: number,
    direction: 1 | -1,
    color: string | CanvasGradient | CanvasPattern, 
  ) {
    this.x = x;
    this.y = y;
    this.absDeltaX = absDeltaX;
    this.direction = direction;
    this.color = color;
  }

  checkCollision(hero: IBoxable) {
    const hb = hero.getBox();
    // console.log(Math.hypot(this.x-hb.x, this.y-hb.y), (PROJECTILE_RADIUS + hb.size)**2);
    return Math.hypot(this.x-hb.x, this.y-hb.y) <= Math.hypot(PROJECTILE_RADIUS + hb.size);
  }

  getBox(): Box {
    return { x: this.x, y: this.y, size: HERO_RADIUS };
  }

  update() {
    this.x += this.absDeltaX*this.direction;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, PROJECTILE_RADIUS, 0, 2*Math.PI);
    ctx.fill();
  }
}
