import { SWorld } from "./core/World";
export default function () {
  const world = SWorld;

  const update = () => {
    world.update();

    window.requestAnimationFrame(() => {
      update();
    });
  };

  const initailize = () => {
    update();
  };

  initailize();
}
