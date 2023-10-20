import * as THREE from "three";
import { SWorld } from "../../core/World.js";
import { sPhysics } from "../../core/Physics.js";
import { Floor } from "./models/Floor.js";
import { Light } from "./tools/Light.js";
import { SEventEmitter } from "../../utils/EventEmitter.js";
import { Bird } from "./models/Bird";
import { Zone } from "./models/Zone.js";

export class Home {
  initialized = false;
  async init() {
    this.world = SWorld;
    this.scene = new THREE.Scene();
    this.world.currentScene = this.scene;

    this.physics = sPhysics;
    this.eventEmitter = SEventEmitter;

    await this.addModels();
    this.initialized = true;
  }

  async addModels() {
    this.floor = new Floor({
      width: 20,
      height: 1,
      depth: 20,
      position: {
        x: 0,
        y: 0,
        z: 0
      }
    });
    this.zone = new Zone({
      width: 2,
      height: 1,
      depth: 2,
      position: {
        x: 7,
        y: 1,
        z: 7
      }
    });

    this.light = new Light();

    this.scene.add(this.floor, this.zone, this.light);
    await this.addGLTFModels();

    this.models = this.scene.children; //.filter((c) => c.isMesh);

    this.physics.add(
      ...this.models.map((model) => model.body).filter((v) => !!v)
    );
  }

  async addGLTFModels() {
    this.bird = new Bird();
    await this.bird.init(3, { x: 0, y: 2, z: 0 });
    this.scene.add(this.bird.instance);
  }

  play() {
    if (!this.initialized) return;
    this.world.update(this.bird.instance, "far");
    this.physics.update(...this.models);

    this.raf = window.requestAnimationFrame(() => {
      this.play();
    });
  }

  dispose() {
    if (!this.initialized) return;

    const children = [...this.scene.children];

    children.forEach((obj) => {
      if (obj.isMesh) {
        obj.geometry.dispose();
        obj.material.dispose();
        if (obj.body) this.physics.removeBody(obj.body);
      }
      this.scene.remove(obj);
    });

    window.cancelAnimationFrame(this.raf);
    this.initialized = false;
  }
}
