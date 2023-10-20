import * as THREE from "three";
import * as CANNON from "cannon-es";
import { SEventEmitter } from "../../../utils/EventEmitter";

export class Goal extends THREE.Mesh {
  name = "goal";
  body_ = null;
  get body() {
    return this.body_;
  }

  set body(body) {
    this.body_ = body;
  }

  constructor({ radius, position }) {
    const geometry = new THREE.ConeGeometry(radius, radius, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x08f26e });
    super(geometry, material);

    this.body = new PhysicsGoal(radius, position);
  }
}
class PhysicsGoal extends CANNON.Body {
  name = "goal";

  constructor(radius, position) {
    const shape = new CANNON.Cylinder(0.1, radius, radius, 12);
    const material = new CANNON.Material();

    super({ shape, material, mass: 0, position });

    this.eventEmitter = SEventEmitter;

    this.eventEmitter.onWin(() => {
      // 프레임사이에 간격이 발생했을 때 scene을 바로 바꿔주는 게 아니라
      // scene을 바꾸는 와중에 이전에 있는 프레임에서 참조를 하며 발생할 수 있는 문제를 해결하기 위해
      // setTimeout을 사용 => task큐에 넣어서 실행을 시키는 것
      setTimeout(() => {
        this.eventEmitter.clear("win");
        this.eventEmitter.changeScene("home");
      }, 0);
    });
  }
}
