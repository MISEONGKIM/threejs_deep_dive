import * as THREE from "three";

export class Star {
  constructor({ scene }) {
    this.scene = scene;

    this.count = 500;
  }

  createStar({ materialOpt, geometryOpt }) {
    //threejs는 일반배열을 넘겨주면 제대로된 데이터 파악을 못함. 보다 정확한 데이터 자료형을 넘겨줘야함
    const positions = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      positions[i] = Math.random() * 3;
      positions[i + 1] = Math.random() * 3;
      positions[i + 2] = Math.random() * 3;
    }
    const particleGemoetry = new THREE.BufferGeometry();
    particleGemoetry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }
}
