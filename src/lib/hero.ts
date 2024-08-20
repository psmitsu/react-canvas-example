import { Box, IBoxable } from "./box";
import { HERO_RADIUS, MOUSE_RADIUS, SIDE_LENGTH } from "./constants";

export class HeroCircle implements IBoxable {
  private x: number;
  private y: number;
  private absDeltaY: number;
  private direction: 1 | -1;
  private color: string | CanvasGradient | CanvasPattern; 

  private shotRate: number;
  private reloadCount: number;

  constructor(
    x: number,
    y: number,
    absDeltaY: number,
    direction: 1 | -1,
    color: string | CanvasGradient | CanvasPattern, 
    shotRate: number,
  ) {
    this.x = x;
    this.y = y;
    this.absDeltaY = absDeltaY;
    this.direction = direction;
    this.color = color;

    this.shotRate = shotRate;
    this.reloadCount = shotRate;
  }

  setSpeed(absDeltaY: number) {
    this.absDeltaY = absDeltaY;
  }

  setShotRate(rate: number) {
    this.shotRate = rate;
  }

  setColor(color: string) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  checkCollision(mouse: IBoxable) {
    const mb = mouse.getBox();
    return Math.hypot(this.x-mb.x, this.y-mb.y) <= (MOUSE_RADIUS*10 + mb.size);
  }

  checkCollisionOnSide(mouse: IBoxable) {
    const mb = mouse.getBox();
    const collision = Math.hypot(this.x-mb.x, this.y-mb.y) <= (MOUSE_RADIUS + mb.size);

    if (collision) {
      if (this.direction === 1 && this.y < mb.y) {
        return true;
      }
      if (this.direction === -1 && this.y > mb.y) {
        return true
      }
    }

    return false;
  }

  changeDirection() {
    this.direction *= -1;
  }

  canShoot(): boolean {
    return this.reloadCount === 0;
  }

  getBox(): Box {
    return { x: this.x, y: this.y, size: HERO_RADIUS };
  }

  update() {
    this.y += this.absDeltaY*this.direction;

    // check collisions
    if ((this.y - HERO_RADIUS) < 0 )  {
      this.direction = 1;
    }

    if ((this.y + HERO_RADIUS) > SIDE_LENGTH) {
      this.direction = -1;
    }

    // reload
    if (this.reloadCount === 0) {
      this.reloadCount = this.shotRate;
    } else {
      this.reloadCount--;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, HERO_RADIUS, 0, 2*Math.PI);
    ctx.fill();
  }
}

