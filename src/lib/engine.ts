const SIDE_LENGTH = 500;

const MIN_SPEED=1;
const MAX_SPEED=10;

const HERO_RADIUS = 25;
const DEFAULT_HERO_SPEED = 3;

const DEFAULT_A_COLOR = '#aabbcc';
const DEFAULT_B_COLOR = '#ccbbaa';

const PROJECTILE_RADIUS = 10;
const PROJECTILE_SPEED = 8;

const MIN_SHOT_RATE=10;
const MAX_SHOT_RATE=60;
const DEFAULT_SHOT_RATE = 50;

const MOUSE_RADIUS = 10;

export { SIDE_LENGTH, 
  MIN_SPEED, MAX_SPEED, DEFAULT_HERO_SPEED, 
  MIN_SHOT_RATE, MAX_SHOT_RATE, DEFAULT_SHOT_RATE,
  DEFAULT_A_COLOR, DEFAULT_B_COLOR,
};

export class DuelEngine {
  private ctx: CanvasRenderingContext2D;
  private frameId = 0;

  private heroA: HeroCircle;
  private heroB: HeroCircle;

  private aProjectiles: Projectile[];
  private bProjectiles: Projectile[];

  private mouse: Mouse;

  private onHeroHit: (heroId: number) => void;

  constructor(
    ctx: CanvasRenderingContext2D,
    onHeroHit: (heroId: number) => void,
    onAClick: () => void,
    onBClick: () => void,
  ) {
    this.ctx = ctx;
    this.onHeroHit = onHeroHit;

    ctx.canvas.width = SIDE_LENGTH;
    ctx.canvas.height = SIDE_LENGTH;

    this.mouse = new Mouse(-1000, -1000);

    ctx.canvas.onclick = (evt) => {
      this.mouse.setPosition(evt.offsetX, evt.offsetY);
      console.log('click', this.mouse.getBox());
      console.log('A box', this.heroA.getBox());

      if (this.heroA.checkCollision(this.mouse)) {
        console.log('AAA');
        onAClick();
      }

      if (this.heroB.checkCollision(this.mouse)) {
        onBClick();
      }
    }

    ctx.canvas.onmousemove = (evt) => {
      this.mouse.setPosition(evt.offsetX, evt.offsetY);
    }

    ctx.canvas.onmouseout = () => {
      this.mouse.setPosition(-1000, -1000);
    }

    this.heroA = new HeroCircle(
      HERO_RADIUS+10,
      HERO_RADIUS,
      DEFAULT_HERO_SPEED,
      1,
      DEFAULT_A_COLOR,
      DEFAULT_SHOT_RATE,
    );

    this.heroB = new HeroCircle(
      SIDE_LENGTH-HERO_RADIUS-10,
      HERO_RADIUS,
      DEFAULT_HERO_SPEED,
      1,
      DEFAULT_B_COLOR,
      DEFAULT_SHOT_RATE,
    );

    this.aProjectiles = [];
    this.bProjectiles = [];
  }

  private update() {
    // check heroes collisions with the mouse
    if (this.heroA.checkCollisionOnSide(this.mouse)) {
      this.heroA.changeDirection();
    }
    if (this.heroB.checkCollisionOnSide(this.mouse)) {
      this.heroB.changeDirection();
    }

    this.heroA.update();
    this.heroB.update();

    // spawn projectiles
    if (this.heroA.canShoot()) {
      const box = this.heroA.getBox();
      this.aProjectiles.push(new Projectile(
        box.x + box.size,
        box.y,
        PROJECTILE_SPEED,
        1,
        this.heroA.getColor(),
      ));
    }

    if (this.heroB.canShoot()) {
      const box = this.heroB.getBox();
      this.bProjectiles.push(new Projectile(
        box.x - box.size,
        box.y,
        PROJECTILE_SPEED,
        -1,
        this.heroB.getColor(),
      ));
    }

    // check projectile collisions

    this.aProjectiles.forEach(p => p.update());

    const prevApLen = this.aProjectiles.length;
    this.aProjectiles = this.aProjectiles.filter(p => !p.checkCollision(this.heroB));
    if (prevApLen > this.aProjectiles.length) {
      this.onHeroHit(0);
    }

    this.aProjectiles = this.aProjectiles.filter(p => {
      const {x, size} = p.getBox();
      return (x + size <= SIDE_LENGTH);
    });

    this.bProjectiles.forEach(p => p.update());
    const prevBpLen = this.bProjectiles.length;
    this.bProjectiles = this.bProjectiles.filter(p => !p.checkCollision(this.heroA));
    if (prevBpLen > this.bProjectiles.length) {
      this.onHeroHit(1);
    }

    this.bProjectiles = this.bProjectiles.filter(p => {
      const {x, size} = p.getBox();
      return (x + size >= 0);
    });
  }

  private render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.heroA.render(this.ctx);
    this.heroB.render(this.ctx);

    this.aProjectiles.forEach(p => p.render(this.ctx));
    this.bProjectiles.forEach(p => p.render(this.ctx));
  }

  setASpeed(speed: number) {
    this.heroA.setSpeed(speed);
  }
  setAShotRate(rate: number) {
    this.heroA.setShotRate(rate);
  }
  setAColor(color: string) {
    this.heroA.setColor(color);
  }

  setBSpeed(speed: number) {
    this.heroB.setSpeed(speed);
  }
  setBShotRate(rate: number) {
    this.heroB.setShotRate(rate);
  }
  setBColor(color: string) {
    this.heroB.setColor(color);
  }

  run() {
    this.update();
    this.render();
    this.frameId = requestAnimationFrame(() => { this.run(); });
  }

  cleanup() {
    cancelAnimationFrame(this.frameId);
  }
}

class HeroCircle implements IBoxable {
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

class Projectile implements IBoxable {
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

class Mouse implements IBoxable {
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

interface Box {
  x: number;
  y: number;
  size: number;
}

interface IBoxable {
  getBox(): Box
}
