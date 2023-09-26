import * as THREE from "three";
import * as CANNON from "cannon-es";
import gsap from "gsap";

export class Roller extends THREE.Mesh {
  name = "Roller";
  body_ = null;

  get body() {
    return this.body_;
  }

  set body(value) {
    this.body_ = value;
  }

  constructor({ width, height, depth, position }) {
    const geometry = new THREE.BoxGeometry(width, height, depth, position);
    const material = new THREE.MeshBasicMaterial({
      color: 0x4682b4
    });

    super(geometry, material);
    this.receiveShadow = false;
    this.castShadow = true;
    this.body = new PhysicsRoller({
      width,
      height,
      depth,
      position
    });
  }
}

export class PhysicsRoller extends CANNON.Body {
  name = "Roller";

  constructor({ width, height, depth, position }) {
    const duration = Math.random() * 2 + 0.5;
    // 터널링 현상을 방지하기 위해 (0.2 / duration ) * (width /2)
    // duration이 빠르면 빠를 수록 충돌 범위 크게
    // 0.2 / duration : duration이 낮을 수록 빠르게 하기위해 나누기 연산
    const shape = new CANNON.Box(
      new CANNON.Vec3(
        width / 2 + (0.2 / duration) * (width / 2),
        height / 2,
        depth / 2
      )
    );
    const material = new CANNON.Material();

    super({ shape, material, mass: 0, position });
    this.update(duration);
  }

  update(duration) {
    const quaternion = {
      y: 0
    };
    gsap.to(quaternion, {
      duration,
      y: Math.PI * 2,
      ease: "none",
      yoyo: false, //한방향으로만
      repeat: -1,
      onUpdate: () => {
        const axis = new CANNON.Vec3(0, 1, 0);
        this.quaternion.setFromAxisAngle(axis, quaternion.y);
      }
    });
  }
}
