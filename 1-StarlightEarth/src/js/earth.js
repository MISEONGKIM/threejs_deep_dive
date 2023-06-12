import * as THREE from "three";

export class Earth {
  constructor({ scene, textureLoader }) {
    this.scene = scene;
    this.textureLoader = textureLoader;
  }

  createEarth({ materialOpt = {}, geometryOpt = {} }) {
    const material = new THREE.MeshStandardMaterial({
      ...materialOpt,
      map: this.textureLoader.load("assets/earth-night-map.jpg"),
      roughness: 0,
      metalness: 0,
    });
    const geometry = new THREE.SphereGeometry(geometryOpt.radius, 30, 30);
    this.mesh = new THREE.Mesh(geometry, material);

    this.scene.add(this.mesh);
  }

  addLight() {
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(2.65, 2.13, 1.02);

    this.scene.add(this.light);
  }
}
