import * as THREE from "three";

export class Earth {
  constructor({ textureLoader }) {
    this.textureLoader = textureLoader;
  }

  create({ materialOpt = {}, geometryOpt = {} }) {
    const material = new THREE.MeshStandardMaterial({
      ...materialOpt,
      map: this.textureLoader.load("assets/earth-night-map.jpg"),
      roughness: 0,
      metalness: 0,
    });
    const geometry = new THREE.SphereGeometry(geometryOpt.radius, 30, 30);
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.y = -Math.PI / 2;
  }

  addLight({ scene }) {
    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(2.65, 2.13, 1.02);

    scene.add(this.light);
  }
}
