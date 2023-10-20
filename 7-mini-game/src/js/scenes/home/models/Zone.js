import * as THREE from "three";
import * as CANNON from "cannon-es";
import { SEventEmitter } from "../../../utils/EventEmitter";

export class Zone extends THREE.Mesh {
  name = "zone";

  constructor({ width, height, depth, position }) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0x08f26e
    });
    super(geometry, material);

    this.position.set(position.x, position.y, position.z);
    this.body = new PhysicsZone({
      width,
      height,
      depth,
      position
    });
    this.receiveShadow = true;
  }
}

class PhysicsZone extends CANNON.Body {
  name = "zone";

  constructor({ width, height, depth, position }) {
    const shape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );

    const material = new CANNON.Material({
      friction: 0.1,
      restitution: 0.5
    });
    super({ shape, material, mass: 0, position });
    this.eventEmitter = SEventEmitter;
    this.eventEmitter.onEnter(() => {
      this.eventEmitter.changeScene("game");
    });
  }
}
