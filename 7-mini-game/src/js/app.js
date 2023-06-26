import { Game } from "./scenes/game/Game";

export default function () {
  const game = new Game();

  const initailize = () => {
    game.play();
  };

  initailize();
}
