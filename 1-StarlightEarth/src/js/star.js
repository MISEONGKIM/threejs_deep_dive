import * as THREE from "three";

export class Star {
  constructor({ scene, textureLoader }) {
    this.scene = scene;
    this.textureLoader = textureLoader;
    this.count = 500;
  }

  createStars() {
    //threejs는 일반배열을 넘겨주면 제대로된 데이터 파악을 못함. 보다 정확한 데이터 자료형을 넘겨줘야함
    const positions = new Float32Array(this.count * 3);
    for (let i = 0; i < this.count; i++) {
      //카메라 z 포지션 위치가 3 이므로 -3~ 3사이로
      positions[i] = (Math.random() - 0.5) * 5; // -3 ~ 3
      positions[i + 1] = (Math.random() - 0.5) * 5; // -3 ~ 3
      positions[i + 2] = (Math.random() - 0.5) * 5; // -3 ~ 3
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.01,
      transparent: true,
      depthWrite: false,
      alphaMap: this.textureLoader.load("assets/particle.png"),
      color: 0xbcc6c6,
    });

    this.points = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.points);
  }
}
