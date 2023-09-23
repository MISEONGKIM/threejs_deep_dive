import * as THREE from "three";
import { SWorld } from "../../core/World.js";
import { sPhysics } from "../../core/Physics.js";
import { Floor } from "./models/Floor.js";
import { Light } from "./tools/Light.js";
import { Player } from "./models/Player.js";

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
    this.floor1 = new Floor({
      width: 5,
      height: 1,
      depth: 20,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    });
    this.floor2 = new Floor({
      width: 5,
      height: 1,
      depth: 15,
      position: {
        x: 0,
        y: 0,
        z: -20
      }
    });
    this.floor3 = new Floor({
      width: 5,
      height: 1,
      depth: 15,
      position: {
        x: 0,
        y: 0,
        z: -35
      }
    });
    this.light = new Light();

    this.scene.add(
      this.player,
      this.floor1,
      this.floor2,
      this.floor3,
      this.light,
      this.light.target,
      new THREE.CameraHelper(this.light.shadow.camera)
    );
    this.physics.add(
      this.player.body,
      this.floor1.body,
      this.floor2.body,
      this.floor3.body
    );
  }

  play() {
    this.world.update(this.player);
    this.light.update(this.world.camera);
    this.physics.update(this.player, this.floor1, this.floor2, this.floor3);

    window.requestAnimationFrame(() => {
      this.play();
    });
  }
}