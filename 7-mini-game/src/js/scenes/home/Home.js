import * as THREE from "three";
import { SWorld } from "../../core/World.js";
import { sPhysics } from "../../core/Physics.js";
import { Floor } from "./models/Floor.js";
import { Light } from "./tools/Light.js";
import { SEventEmitter } from "../../utils/EventEmitter.js";
import { Bird } from "./models/Bird";

export class Home {
  async init() {
    this.world = SWorld;
    this.scene = new THREE.Scene();
    this.world.currentScene = this.scene;

    this.physics = sPhysics;
    this.eventEmitter = SEventEmitter;

    await this.addModels();
  }

  async addModels() {
    this.floor = new Floor({
      width: 20,
      height: 1,
      depth: 20,
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
    });

    this.light = new Light();

    this.scene.add(this.floor, this.light);
    await this.addGLTFModels();

    this.models = this.scene.children.filter((c) => c.isMesh);
    this.physics.add(
      ...this.models.map((model) => model.body).filter((v) => !!v)
    );
  }

  async addGLTFModels() {
    this.bird = new Bird();
    await this.bird.init();
  }

  play() {
    this.world.update(this.player);
    this.physics.update(...this.models);

    window.requestAnimationFrame(() => {
      this.play();
    });
  }
}
