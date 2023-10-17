import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Physics extends CANNON.World {
  clock = new THREE.Clock();
  constructor() {
    super();

    this.gravity = new CANNON.Vec3(0, -9.82, 0);
    this.broadphase = new CANNON.SAPBroadphase(this);
    this.allowSleep = true;
  }

  add(...bodies) {
    bodies.forEach((body) => this.addBody(body));
  }

  update(...models) {
    const deltaTime = this.clock.getDelta();
    // 브라우저의 성능에 따라 step함수의 시간간격에 따라 오차가 발생할 수 있음
    // 이 오차를 줄이기 위해 2번째 인자로 deltaTime 넘겨줌 => 정확하게 step 함수호출, 걍 기억해라
    this.step(1 / 60, deltaTime);

    models.forEach((model) => {
      if (!model.body) return;
      model.position.copy(model.body.position);
      model.quaternion.copy(model.body.quaternion);
    });
  }
}

export const sPhysics = new Physics();
