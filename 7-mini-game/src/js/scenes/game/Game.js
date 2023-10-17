import * as THREE from "three";
import { SWorld } from "../../core/World.js";
import { sPhysics } from "../../core/Physics.js";
import { Floor } from "./models/Floor.js";
import { Light } from "./tools/Light.js";
import { Player } from "./models/Player.js";
import { Barricade } from "./models/Barricade.js";
import { Roller } from "./models/Roller.js";
import { Goal } from "./models/Goal";

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
        y: 3,
        z: 9,
      },
    });
    this.floor1 = new Floor({
      width: 5,
      height: 1,
      depth: 20,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    });
    this.floor2 = new Floor({
      width: 5,
      height: 1,
      depth: 15,
      position: {
        x: 0,
        y: 0,
        z: -20,
      },
    });
    this.floor3 = new Floor({
      width: 5,
      height: 1,
      depth: 15,
      position: {
        x: 0,
        y: 0,
        z: -35,
      },
    });
    this.barricade1 = new Barricade({
      width: 1.5,
      height: 1.5,
      depth: 0.5,
      position: { x: -1.5, y: 1.4, z: 3 },
    });
    this.barricade2 = new Barricade({
      width: 1.5,
      height: 1.5,
      depth: 0.5,
      position: { x: 2, y: 1.4, z: -2 },
    });
    this.roller = new Roller({
      width: 0.3,
      height: 0.3,
      depth: 4,
      position: { x: 0, y: 1, z: -17 },
    });
    this.goal = new Goal({ radius: 1, position: { x: 0, y: 1, z: -35 } });
    this.light = new Light();

    this.scene.add(
      this.player,
      this.floor1,
      this.floor2,
      this.floor3,
      this.light,
      this.light.target,
      this.barricade1,
      this.barricade2,
      this.roller,
      this.goal
      // new THREE.CameraHelper(this.light.shadow.camera)
    );
    this.physics.add(
      this.player.body,
      this.floor1.body,
      this.floor2.body,
      this.floor3.body,
      this.barricade1.body,
      this.barricade2.body,
      this.roller.body,
      this.goal.body
    );
  }

  play() {
    this.world.update(this.player);
    this.light.update(this.world.camera);
    this.physics.update(
      this.player,
      this.floor1,
      this.floor2,
      this.floor3,
      this.barricade1,
      this.barricade2,
      this.roller,
      this.goal
    );

    window.requestAnimationFrame(() => {
      this.play();
    });
  }
}
