import * as THREE from "three";
import { SWorld } from "../../core/World";
import { Floor } from "./models/Floor";
import { Light } from "./tools/Light";

export class Game {
  constructor() {
    this.world = SWorld;
    this.scene = new THREE.Scene();
    this.world.currentScene = this.scene;

    this.addModels();
  }

  addModels() {
    this.floor = new Floor({
      width: 4,
      height: 1,
      depth: 4,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    this.light = new Light();
    this.scene.add(this.floor, this.light);
  }

  play() {
    this.world.update();

    window.requestAnimationFrame(() => {
      this.play();
    });
  }
}
