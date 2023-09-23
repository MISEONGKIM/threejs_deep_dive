import { Game } from "./scenes/game/Game.js";

export default function () {
  const game = new Game();

  const initailize = () => {
    game.play();
  };

  initailize();
}
