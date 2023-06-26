import * as THREE from "three";
import { Renderer } from "../utils/Renderer";
import { Camera } from "./../utils/Camera";
import { Sizer } from "./../utils/Sizer";

export class World {
  constructor(canvasEl) {
    this.domElement = canvasEl;
    this.scene = new THREE.Scene();
    this.sizer = new Sizer();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
  }
}

export const SWorld = new World(document.querySelector("#canvas"));
