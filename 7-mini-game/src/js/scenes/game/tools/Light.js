import * as THREE from "three";

export class Light extends THREE.DirectionalLight {
  constructor() {
    super(0xffffff);
    this.position.set(0, 5, 0);
    this.castShadow = true;
    this.shadow.mapSize.width = 2048;
    this.shadow.mapSize.height = 2048;
  }

  update({ position }) {
    // 플레이어를 따라서 조명이동
    this.position.set(position.x, 5, position.z);
    this.target.position.set(0, 3, position.z);
  }
}
