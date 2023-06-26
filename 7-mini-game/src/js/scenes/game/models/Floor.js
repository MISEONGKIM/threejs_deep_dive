import * as THREE from "three";

export class Floor extends THREE.Mesh {
  name = "floor";
  constructor({ width, height, depth, position }) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });
    super(geometry, material);

    this.position.set(position.x, position.y, position.z);
  }
}
