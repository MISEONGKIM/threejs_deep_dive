import * as THREE from "three";
import * as CANNON from "cannon-es";
import { sPhysics } from "../../../core/Physics.js";

export class Player extends THREE.Mesh {
  name = "player";
  isReset = false;
  constructor({ radius, position }) {
    const geometry = new THREE.SphereGeometry(radius, 30, 30);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
    });

    super(geometry, material);

    this.body = new PhysicsPlayer({ radius, position });
    this.castShadow = true;
    this.receiveShadow = false;
  }
}

class PhysicsPlayer extends CANNON.Body {
  name = "player";

  constructor({ radius, position }) {
    const shape = new CANNON.Sphere(radius);
    const material = new CANNON.Material({
      friction: 0.1,
      restitution: 0.5,
    });

    super({ shape, material, mass: 10, position });
    this.phsics = sPhysics;

    this.addKeyDownEvent();
  }

  addKeyDownEvent() {
    let isArrowUpPressed = false;
    let isArrowDownPressed = false;
    let isArrowLeftPressed = false;
    let isArrowRightPressed = false;
    let isSpacePressed = false;
    let isLanded = false;

    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowUp") {
        isArrowUpPressed = true;
      }
      if (e.code === "ArrowDown") {
        isArrowDownPressed = true;
      }
      if (e.code === "ArrowLeft") {
        isArrowLeftPressed = true;
      }
      if (e.code === "ArrowRight") {
        isArrowRightPressed = true;
      }
      if (e.code === "Space" && isLanded) {
        isSpacePressed = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowUp") {
        isArrowUpPressed = false;
      }
      if (e.code === "ArrowDown") {
        isArrowDownPressed = false;
      }
      if (e.code === "ArrowLeft") {
        isArrowLeftPressed = false;
      }
      if (e.code === "ArrowRight") {
        isArrowRightPressed = false;
      }
      if (e.code === "Space") {
        isSpacePressed = false;
      }
    });

    //물리시뮬레이션에서 한 스텝이 지난다음 호출되는 이벤트
    this.phsics.addEventListener("postStep", () => {
      if (this.isReset) return;
      const x = isArrowLeftPressed ? -1 : isArrowRightPressed ? 1 : 0;
      const y = isSpacePressed && isLanded ? 5 : 0;
      const z = isArrowUpPressed ? -1 : isArrowDownPressed ? 1 : 0;

      if (isSpacePressed) isLanded = false;

      this.applyImpulse(new CANNON.Vec3(x, y, z));
    });

    // 충돌했을 때 호출되는 이벤트
    this.addEventListener("collide", (e) => {
      //땅에 닿았는지 확인
      if (e.body.name === "floor" && !isLanded) isLanded = true;
    });
  }

  reset() {
    this.position.copy(this.initPosition);
    this.mass = 0;
    this.velocity.set(0, 0, 0);
    this.isReset = true;
  }
}
