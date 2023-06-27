import * as THREE from "three";
import { Renderer } from "../utils/Renderer";
import { Camera } from "./../utils/Camera";
import { Sizer } from "./../utils/Sizer";
import { SEventEmitter } from "./../utils/EventEmitter";

export class World {
  currentScene_ = null;
  get currentScene() {
    return this.currentScene_;
  }
  set currentScene(scene) {
    this.currentScene_ = scene;
  }

  constructor(canvasEl) {
    this.domElement = canvasEl;
    this.eventEmitter = SEventEmitter;

    this.sizer = new Sizer();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);

    this.eventEmitter.onResize(() => this.resize());
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update(player) {
    this.camera.update(player);
    this.renderer.update();
  }
}

export const SWorld = new World(document.querySelector("#canvas"));
