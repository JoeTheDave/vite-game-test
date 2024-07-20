import Renderer from "./renderer";

export default class GameData {
  renderer: Renderer;
  keys: { [key: string]: boolean } = {};
  lastTick: number;
  delta: number;
  frames: number;
  elapsedTime: number;

  x: number;
  y: number;
  radius: number;

  constructor(renderer: Renderer) {
    this.renderer = renderer;
    this.keys = {};
    this.lastTick = 0;
    this.delta = 0;
    this.frames = 0;
    this.elapsedTime = 0;

    this.x = this.renderer.canvas.width / 2;
    this.y = this.renderer.canvas.height / 2;
    this.radius = 10;
  }

  update = () => {
    const currentTick = performance.now();
    const delta = currentTick - this.lastTick;
    this.lastTick = currentTick;
    this.elapsedTime += delta;

    this.delta = delta;
    this.frames++;
    if (this.keys["w"]) {
      this.y -= 0.25 * this.delta;
    }

    if (this.keys["s"]) {
      this.y += 0.25 * this.delta;
    }

    if (this.keys["a"]) {
      this.x -= 0.25 * this.delta;
    }

    if (this.keys["d"]) {
      this.x += 0.25 * this.delta;
    }
  };
}
