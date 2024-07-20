import Renderer from "./renderer";
import GameData from "./gameData";

const showPerformanceStatistics = true;

export default class Game {
  renderer: Renderer;
  gameData: GameData;

  constructor() {
    this.renderer = new Renderer(showPerformanceStatistics);
    this.gameData = new GameData(this.renderer);
  }

  gameLoop = () => {
    if (!this) {
      return;
    }

    this.gameData.update();
    this.renderer.draw(this.gameData);
    requestAnimationFrame(this.gameLoop);
  };

  initListeners = () => {
    document.addEventListener("keydown", (event) => {
      this.gameData.keys[event.key] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.gameData.keys[event.key] = false;
    });
  };

  initialize = () => {
    this.initListeners();
    this.gameLoop();
  };
}
