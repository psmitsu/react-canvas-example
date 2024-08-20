import { DEFAULT_A_COLOR, DEFAULT_B_COLOR, DEFAULT_HERO_SPEED, DEFAULT_SHOT_RATE, HERO_RADIUS, PROJECTILE_SPEED, SIDE_LENGTH } from "./constants";
import { HeroCircle } from "./hero";
import { Mouse } from "./mouse";
import { Projectile } from "./projectile";

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
      // console.log('click', this.mouse.getBox());
      // console.log('A box', this.heroA.getBox());

      if (this.heroA.checkCollision(this.mouse)) {
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
