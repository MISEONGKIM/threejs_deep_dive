import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class Loader {
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }
}

export const SLoader = new Loader();
