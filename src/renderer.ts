import GameData from "./gameData";

export default class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  showPerformanceStatistics: boolean;

  constructor(showPerformanceStatistics: boolean) {
    this.canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.showPerformanceStatistics = showPerformanceStatistics;

    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawText = (
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontColor: string
  ) => {
    this.ctx.font = `${fontSize}px Verdana`;
    this.ctx.fillStyle = fontColor;
    this.ctx.fillText(text, x, y);
  };

  clear = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  displayPerformanceStatistics = (data: GameData) => {
    const x = 5;
    const y = 5;
    const fontSize = 12;
    const lineSpacing = fontSize + 2;
    const fps = Math.floor(1000 / data.delta);
    const seconds = Math.floor(data.elapsedTime / 1000);
    this.drawText(`FPS: ${fps}`, 5, lineSpacing * 1, fontSize, "white");
    this.drawText(
      `Frames: ${data.frames}`,
      5,
      lineSpacing * 2,
      fontSize,
      "white"
    );
    this.drawText(`Time: ${seconds}`, 5, lineSpacing * 3, fontSize, "white");
  };

  draw = (data: GameData) => {
    this.clear();
    if (this.showPerformanceStatistics) {
      this.displayPerformanceStatistics(data);
    }

    this.ctx.beginPath();
    this.ctx.arc(data.x, data.y, data.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "red";
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
    // ctx.fill();
    this.ctx.closePath();
  };
}
