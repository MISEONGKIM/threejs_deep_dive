import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Camera extends THREE.PerspectiveCamera {
  get sizer() {
    return this.world.sizer;
  }

  constructor(world) {
    super(75, world.sizer.width / world.sizer.height, 0.1, 100);
    this.world = world;

    this.addControls();
  }

  addControls() {
    this.controls = new OrbitControls(this, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
  }

  resize() {
    this.aspect = this.sizer.width / this.sizer.height;
    this.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
