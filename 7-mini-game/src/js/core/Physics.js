import * as CANNON from "cannon-es";

export class Physics extends CANNON.World {
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
    this.step(1 / 60);

    models.forEach((model) => {
      if (!model.body) return;
      model.position.copy(model.body.position);
      model.quaternion.copy(model.body.quaternion);
    });
  }
}

export const sPhysics = new Physics();
