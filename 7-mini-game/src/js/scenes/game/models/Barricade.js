import * as THREE from "three";
import * as CANNON from "cannon-es";
import gsap from "gsap";

export class Barricade extends THREE.Mesh {
  name = "barricade";
  body_ = null;

  get body() {
    return this.body_;
  }

  set body(value) {
    this.body_ = value;
  }

  constructor({ width, height, depth, position }) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshBasicMaterial({
      color: 0x964b00,
    });

    super(geometry, material);
    this.receiveShadow = false;
    this.castShadow = true;
    this.body = new PhysicsBarricade({
      width,
      height,
      depth,
      position,
    });
  }
}

export class PhysicsBarricade extends CANNON.Body {
  name = "barricade";
  originX = 0;

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
    this.originX = position.x;
    this.update(duration);
  }

  update(duration) {
    this.anime = gsap.to(this.position, {
      duration,
      x: -this.originX,
      ease: "power1.inOut",
      yoyo: true, //애니메이션이 끝났을 때 다시 돌아오도록
      repeat: -1,
    });
  }

  reset() {
    this.anime.kill();
  }
}
