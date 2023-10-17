import { Game } from "./scenes/game/Game.js";
import { Home } from "./scenes/home/Home";

export default async function () {
  // const game = new Game();
  const home = new Home();
  await home.init();
  const initailize = () => {
    home.play();
  };

  initailize();
}
