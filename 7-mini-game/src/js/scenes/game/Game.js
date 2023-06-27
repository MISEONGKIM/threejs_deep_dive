import * as THREE from "three";
import { SWorld } from "../../core/World";
import { sPhysics } from "../../core/Physics";
import { Floor } from "./models/Floor";
import { Light } from "./tools/Light";
import { Player } from "./models/Player";

export class Game {
  constructor() {
    this.world = SWorld;
    this.scene = new THREE.Scene();
    this.world.currentScene = this.scene;

    this.physics = sPhysics;

    this.addModels();
  }

  addModels() {
    this.player = new Player({
      radius: 0.3,
      position: {
        x: 0,
        y: 5,
        z: 0
      }
    });
    this.floor = new Floor({
      width: 4,
      height: 1,
      depth: 4,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    });
    this.light = new Light();

    this.scene.add(this.player, this.floor, this.light);
    this.physics.add(this.player.body, this.floor.body);
  }

  play() {
    this.world.update();
    this.physics.update(this.player, this.floor);

    window.requestAnimationFrame(() => {
      this.play();
    });
  }
}
