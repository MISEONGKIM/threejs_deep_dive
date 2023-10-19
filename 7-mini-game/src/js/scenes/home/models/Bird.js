import * as THREE from "three";
import * as CANNON from "cannon-es";
import { sPhysics } from "../../../core/Physics.js";
import { SLoader } from "../../../utils/Loader.js";

export class Bird {
  name = "bird";
  body_ = null;
  get body() {
    return this.body_;
  }
  set body(body) {
    this.body_ = body;
  }

  constructor() {
    this.loader = SLoader;
  }

  async init(scale, position) {
    this.instance_ = await this.load();
    console.log(this.instance_);
    this.instance_.scale.set(scale, scale, scale);
    this.instance_.position.set(position.x, position.y, position.z);
    this.instance_.castShadow = true;
    this.instance_.receiveShadow = false;
    // traverse : child를 모두 순회하는 함수
    this.instance_.traverse((child) =>
      child.isMesh ? (child.castShadow = true) : null
    );
    this.instance_.body = new PhysicsBird(this.instance_);
  }

  async load() {
    return new Promise((resolve) => {
      this.loader.gltfLoader.load("assets/bird/scene.gltf", (gltf) => {
        resolve(gltf.scene);
      });
    });
  }
}

class PhysicsBird extends CANNON.Body {
  name = "bird";
  isReset = false;

  constructor(bird) {
    const shape = new CANNON.Sphere(0.4);
    const material = new CANNON.Material({
      friction: 0.1,
      restitution: 0.5
    });

    super({
      shape,
      material,
      mass: 10,
      position: new CANNON.Vec3(
        bird.position.x,
        bird.position.y,
        bird.position.z
      )
    });
    this.phsics = sPhysics;

    this.addKeyDownEvent();
  }

  addKeyDownEvent() {
    let isArrowUpPressed = false;
    let isArrowDownPressed = false;
    let isArrowLeftPressed = false;
    let isArrowRightPressed = false;
    let isSpacePressed = false;

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
      if (e.code === "Space") {
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

    let ry = 0;
    const forceAmount = 10;
    let canJump = false;
    const contactNormal = new CANNON.Vec3(0, 0, 0);
    //contactNormal의 내적을 구해서 점프할 수 있는 지 체크
    const upAxis = new CANNON.Vec3(0, 1, 0); // y값을 1로 설정해서 위로 향하는 지 확인

    // 충돌했을 때 호출되는 이벤트
    this.addEventListener("collide", (e) => {
      const contact = e.contact;
      canJump = false;

      if (contact.bi.id === this.id) {
        //충돌하는 법선 백터의 방향을 부정시킴
        contact.ni.negate(contactNormal);
      }

      const dot = contactNormal.dot(upAxis);
      if (dot > 0.5) {
        canJump = true;
      }
    });

    //물리시뮬레이션에서 한 스텝이 지난다음 호출되는 이벤트
    this.phsics.addEventListener("postStep", () => {
      if (this.isReset) return;
      const speed = 5;
      const x = isArrowLeftPressed ? -1 : isArrowRightPressed ? 1 : 0;
      const y = 10;
      const z = isArrowUpPressed ? -1 : isArrowDownPressed ? 1 : 0;

      if (isSpacePressed && canJump) {
        this.velocity.y = y;
        canJump = false;
      }

      //키보드 입력 없으면 속도 0 줘서 중지
      if (x === 0 && z === 0) {
        this.velocity.x = 0;
        this.velocity.z = 0;
      } else {
        ry = Math.atan2(x, z);
        this.velocity.x = x * speed;
        this.velocity.y = y * speed;

        // Math.sin(ry), Math.sin(ry), Math.cos(ry) : 힘의 방향
        const force = new CANNON.Vec3(
          forceAmount * Math.sin(ry),
          forceAmount * Math.sin(ry),
          forceAmount * Math.cos(ry)
        );
        this.applyForce(force, this.position);
      }

      // 돌아가지 않도록 축 지정
      this.quaternion.setFromEuler(0, ry, 0);
    });
  }

  reset() {
    this.position.copy(this.initPosition);
    this.mass = 0;
    this.velocity.set(0, 0, 0);
    this.isReset = true;
  }
}
