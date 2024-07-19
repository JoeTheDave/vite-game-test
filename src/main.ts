const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let x: number = canvas.width / 2;
let y: number = canvas.height / 2;

const radius: number = 10;
let lastTick: number = performance.now();

const keys: { [key: string]: boolean } = {};

const update = (delta: number) => {
  console.log(delta);
  if (keys["w"]) {
    y -= 0.25 * delta;
  }

  if (keys["s"]) {
    y += 0.25 * delta;
  }

  if (keys["a"]) {
    x -= 0.25 * delta;
  }

  if (keys["d"]) {
    x += 0.25 * delta;
  }
};

const drawText = (
  text: string,
  x: number,
  y: number,
  fontSize: string,
  fontColor: string
) => {
  ctx.font = `${fontSize} Arial`;
  ctx.fillStyle = fontColor;
  ctx.fillText(text, x, y);
};

const draw = (delta: number) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawText(`${Math.floor(1000 / delta)}`, 5, 15, "12px", "white");
  console.log(keys);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.strokeStyle = "white";
  ctx.stroke();
  // ctx.fill();
  ctx.closePath();
};

document.addEventListener("keydown", function (event) {
  keys[event.key] = true;
});

document.addEventListener("keyup", function (event) {
  keys[event.key] = false;
});

function gameLoop() {
  const currentTick = performance.now();
  const delta = currentTick - lastTick;
  lastTick = currentTick;
  update(delta);
  draw(delta);
  requestAnimationFrame(gameLoop);
}

gameLoop();
